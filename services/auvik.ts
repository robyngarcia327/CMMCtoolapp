
import { AuvikConfig, AuvikDevice } from '../types';

// Simulate fetching network topology from Auvik
export const fetchAuvikNetworkTopology = async (config: AuvikConfig): Promise<AuvikDevice[]> => {
    console.log(`Connecting to Auvik (${config.region}) for Tenant: ${config.tenantId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return a mock "Flat Network" topology that typically triggers a recommendation for segmentation
    return [
        {
            id: 'dev-1',
            name: 'Core-Switch-01',
            type: 'Switch',
            ipAddress: '192.168.1.2',
            vlan: '1',
            firmware: 'v12.4(25)',
            isOnline: true
        },
        {
            id: 'dev-2',
            name: 'Edge-Firewall',
            type: 'Firewall',
            ipAddress: '192.168.1.1',
            vlan: '1',
            firmware: 'v9.1.5',
            isOnline: true
        },
        {
            id: 'dev-3',
            name: 'HR-FileServer',
            type: 'Server',
            ipAddress: '192.168.1.15',
            vlan: '1',
            isOnline: true
        },
        {
            id: 'dev-4',
            name: 'Eng-Workstation-05',
            type: 'Workstation',
            ipAddress: '192.168.1.105',
            vlan: '1',
            isOnline: true
        },
        {
            id: 'dev-5',
            name: 'Guest-WiFi-AP',
            type: 'AccessPoint',
            ipAddress: '192.168.1.50',
            vlan: '1', // Intentionally bad config (Guest on same VLAN)
            isOnline: true
        },
        {
            id: 'dev-6',
            name: 'Unmanaged-IoT-Camera',
            type: 'Workstation',
            ipAddress: '192.168.1.200',
            vlan: '1',
            isOnline: true
        }
    ];
};
