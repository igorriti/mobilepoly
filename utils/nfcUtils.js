import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';

// Initialize NFC Manager
export const initNfc = async () => {
    try {
        const isSupported = await NfcManager.isSupported();
        if (isSupported) {
            await NfcManager.start();
            return true;
        }
        return false;
    } catch (error) {
        console.warn('Error initializing NFC:', error);
        return false;
    }
};

// Clean up NFC
export const cleanUpNfc = () => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.setEventListener(NfcEvents.SessionClosed, null);
};

// Get consistent tag ID for ISO-DEP cards
const getIsoDepId = async () => {
    try {
        // Try to get card info using standard commands
        const responses = [];
        
        // Get ATS (Answer to Select)
        try {
            const ats = await NfcManager.transceive([0x00, 0xA4, 0x04, 0x00]);
            if (ats && ats.length > 0) responses.push(...ats);
        } catch (e) {}

        // Get UID using GET DATA command
        try {
            const uid = await NfcManager.transceive([0x00, 0xCA, 0x00, 0x00, 0x00]);
            if (uid && uid.length > 0) responses.push(...uid);
        } catch (e) {}

        // If we got any responses, combine them for a unique identifier
        if (responses.length > 0) {
            const uniqueId = responses.map(byte => ('0' + byte.toString(16)).slice(-2)).join('');
            console.log('Combined ISO-DEP responses:', uniqueId);
            return uniqueId;
        }

        return null;
    } catch (error) {
        console.warn('Error reading ISO-DEP:', error);
        return null;
    }
};

// Start scanning for any NFC tag
export const startNfcScan = (onTagFound, onIsoDepDetected, scanContext = 'nfc') => {
    return new Promise((resolve) => {
        let tagFound = false;
        let isHandlingIsoDep = false;

        const handleTag = async (tag) => {
            try {
                if (!tagFound) {
                    tagFound = true;

                    // Check if it's an ISO-DEP card
                    if (tag.techTypes && tag.techTypes.includes('android.nfc.tech.IsoDep')) {
                        console.log('Detected ISO-DEP card, getting specific data...');
                        isHandlingIsoDep = true;
                        
                        try {
                            await NfcManager.requestTechnology(NfcTech.IsoDep);
                            const isoDepId = await getIsoDepId();
                            
                            if (isoDepId) {
                                console.log('Using ISO-DEP specific ID:', isoDepId);
                                onTagFound({ ...tag, id: isoDepId });
                                resolve(true);
                                return;
                            } else {
                                // Notify that we need another scan for ISO-DEP
                                if (onIsoDepDetected) {
                                    onIsoDepDetected(scanContext);
                                }
                                resolve(false);
                                return;
                            }
                        } catch (error) {
                            console.warn('Error handling ISO-DEP:', error);
                        } finally {
                            try {
                                await NfcManager.cancelTechnologyRequest();
                            } catch (err) {}
                            isHandlingIsoDep = false;
                        }
                    }

                    // For NDEF formatted cards
                    if (tag.ndefId) {
                        console.log('Using NDEF ID:', tag.ndefId);
                        onTagFound({ ...tag, id: tag.ndefId });
                        resolve(true);
                        return;
                    }

                    // For cards with standard UID
                    if (tag.uid) {
                        console.log('Using UID:', tag.uid);
                        onTagFound({ ...tag, id: tag.uid });
                        resolve(true);
                        return;
                    }

                    // For cards with historical bytes
                    if (tag.historicalBytes) {
                        const historicalId = tag.historicalBytes.join('');
                        console.log('Using historical bytes:', historicalId);
                        onTagFound({ ...tag, id: historicalId });
                        resolve(true);
                        return;
                    }

                    // Last resort: use standard ID
                    if (tag.id) {
                        console.log('Using standard ID:', tag.id);
                        onTagFound({ ...tag, id: tag.id });
                        resolve(true);
                        return;
                    }

                    console.log('No suitable ID found in tag');
                    resolve(false);
                }
            } catch (error) {
                console.warn('Error processing tag:', error);
                resolve(false);
            } finally {
                if (!isHandlingIsoDep) {
                    await NfcManager.unregisterTagEvent();
                }
            }
        };

        NfcManager.setEventListener(NfcEvents.DiscoverTag, handleTag);
        NfcManager.setEventListener(NfcEvents.SessionClosed, () => {
            if (!tagFound && !isHandlingIsoDep) {
                resolve(false);
            }
        });

        NfcManager.registerTagEvent();
    });
};

// Stop scanning
export const stopNfcScan = async () => {
    try {
        await NfcManager.unregisterTagEvent();
    } catch (error) {
        console.warn('Error stopping NFC scan:', error);
    }
}; 