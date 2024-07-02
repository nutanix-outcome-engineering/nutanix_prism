'use strict'
const axios = require('axios')
const https = require('https')
const FormData = require('form-data');

// PRISM CLUSTER FUNCTIONS
module.exports.cluster = {
    get: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/cluster/'
        opts.method = 'GET'
        return call(opts)
    },
    patch: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/cluster'
        opts.method = 'PATCH'
        return call(opts)
    },
    setDataServicesIPv2: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/cluster'
        opts.method = 'PATCH'
        opts.body = {
            cluster_external_data_services_ipaddress: opts.dataServicesIP
        }
        return call(opts)
    },
    setDataServicesIPv1: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/cluster'
        opts.method = 'PATCH'
        opts.body = {
            clusterExternalDataServicesIPAddress: opts.dataServicesIP
        }
        return call(opts)
    },
    setSMTPv1: opts => {
        opts.url = `https://${opts.ip}:9440/PrismGateway/services/rest/v1/cluster/smtp`
        opts.method = 'PUT'
        opts.body = {
            "serverAddress": {
              "hostname": opts.serverAddress
            },
            "port": opts.port,
            "secureMode": opts.secureMode || 'NONE',
            "fromEmailAddress": opts.fromEmailAddress || 'noreply@nutanix.com'
          }
          if (opts.username) {opts.body.username = opts.username}
          if (opts.password) {opts.body.password = opts.password}
          return call(opts)
        },
    importPECertificate: opts => {
        opts.url =`https://${opts.ip}:9440/PrismGateway/services/rest/v1/keys/pem/import`
        opts.method = 'POST'
        // Options: RSA_2048, RSA_4096, ECDSA_256, ECDSA_384, ECDSA_521
        let keyType = opts.keyType || 'RSA_4096'
        const form = new FormData();
        form.append('keyType', keyType);
        form.append('key', opts.key);
        form.append('cert', opts.cert);
        form.append('caChain', opts.caChain);

        return postForm(opts,form)
    },
    addSSHKey: opts => {
        opts.url =`https://${opts.ip}:9440/PrismGateway/services/rest/v1/cluster/public_keys`
        opts.method = 'POST'
        opts.body = {
            "name": opts.keyName,
            "key": opts.key
          }
        return call(opts)
    },
    getSSHKeys: opts => {
        opts.url =`https://${opts.ip}:9440/PrismGateway/services/rest/v1/cluster/public_keys`
        opts.method = 'GET'
        return call(opts)
    },
    getAuthConfig: opts => {
        opts.url =`https://${opts.ip}:9440/PrismGateway/services/rest/v1/authconfig`
        opts.method = 'GET'
        return call(opts)
    },
    enableAllAuthTypes: opts => {
        opts.url =`https://${opts.ip}:9440/PrismGateway/services/rest/v1/authconfig/auth_types`
        opts.method = 'PUT'
        opts.body = ["LOCAL","DIRECTORY_SERVICE"]
        return call(opts)
    },
    addActiveDirectory: opts => {
        opts.url =`https://${opts.ip}:9440/PrismGateway/services/rest/v1/authconfig/directories`
        opts.method = 'POST'
        opts.body = {
            "name": `${opts.directoryName}`,
            "domain": `${opts.domain}`,
            "directoryUrl": `${opts.directoryUrl}`,
            "groupSearchType": "NON_RECURSIVE",
            "directoryType": "ACTIVE_DIRECTORY",
            "connectionType": "LDAP",
            "serviceAccountUsername": `${opts.serviceAccountUsername}`,
            "serviceAccountPassword": `${opts.serviceAccountPassword}`
          }
        if (opts.groupSearchType) {opts.body.groupSearchType = opts.groupSearchType}
        return call(opts)
    },
    getRoleMappings: opts => {
        opts.url =`https://${opts.ip}:9440/PrismGateway/services/rest/v1/authconfig/directories/${opts.directoryName}/role_mappings`
        opts.method = 'GET'
        return call(opts)
    },
    addUserAdminRoleMappingToUser: opts => {
        opts.url =`https://${opts.ip}:9440/PrismGateway/services/rest/v1/authconfig/directories/${opts.directoryName}/role_mappings`
        opts.method = 'POST'
        opts.body = {
            "directoryName": `${opts.directoryName}`,
            "role": 'ROLE_USER_ADMIN',
            "entityType": 'USER',
            "entityValues": [
              `${opts.username}`
            ]
          }
        return call(opts)
    },
    addDNSServerList: opts => {
        opts.url = `https://${opts.ip}:9440/PrismGateway/services/rest/v1/cluster/name_servers/add_list`
        opts.method = 'POST'
        let dnsServers = opts.dnsServerList.map((dnsServer) => ({"ipv4":dnsServer}))
        opts.body = dnsServers
        return call(opts)
    },
    removeDNSServerList: opts => {
        opts.url = `https://${opts.ip}:9440/PrismGateway/services/rest/v1/cluster/name_servers/remove_list`
        opts.method = 'POST'
        let dnsServers = opts.dnsServerList.map((dnsServer) => ({"ipv4":dnsServer}))
        opts.body = dnsServers
        return call(opts)
    },
    getNTPServerList: opts => {
        opts.url =`https://${opts.ip}:9440/PrismGateway/services/rest/v1/cluster/ntp_servers`
        opts.method = 'GET'
        return call(opts)
    },
    addNTPServerList: opts => {
        opts.url = `https://${opts.ip}:9440/PrismGateway/services/rest/v1/cluster/ntp_servers/add_list`
        opts.method = 'POST'
        let ntpServers = opts.ntpServerList.map((ntpServer) => ({"ipv4":ntpServer}))
        opts.body = ntpServers
        return call(opts)
    },
    removeNTPServerList: opts => {
        opts.url = `https://${opts.ip}:9440/PrismGateway/services/rest/v1/cluster/ntp_servers/remove_list`
        opts.method = 'POST'
        let ntpServers = opts.ntpServerList.map((ntpServer) => ({"ipv4":ntpServer}))
        opts.body = ntpServers
        return call(opts)
    },
    getLCMConfig: opts => {
        opts.url = `https://${opts.ip}:9440/api/lcm/v4.0.a1/resources/config`
        opts.method = 'GET'
        return call(opts)
    },
    setLCMConfig: opts => {
        opts.url = `https://${opts.ip}:9440/api/lcm/v4.0.a1/resources/config`
        opts.method = 'PUT'
        opts.body = {
            "$reserved": {
              "ETag": `${opts.etag}`
            },
            "$objectType": "lcm.v4.resources.LcmConfig",
            "$unknownFields": {}
        }
        if (opts.darkSiteUrl) {
            opts.body.isDarksite = true
            opts.body.url = opts.darkSiteUrl
            if(opts.darkSiteUrl.includes('https://')) {
                opts.body.enableHttps = true
            }
        }
        else {
            opts.body.isDarksite = false
        }
        if(opts.enableHttps) {opts.body.enableHttps = true}
        return callv4(opts)
    },
    performLCMInventory: opts => {
        opts.url = `https://${opts.ip}:9440/api/lcm/v4.0.a1/operations/$actions/performInventory`
        opts.method = 'POST'
        return call(opts)
    },
    getAlertConfig: opts => {
        opts.url = `https://${opts.ip}:9440/PrismGateway/services/rest/v1/alerts/configuration`
        opts.method = 'GET'
        return call(opts)
    },
    disableAlertEmails: opts => {
        opts.url = `https://${opts.ip}:9440/PrismGateway/services/rest/v1/alerts/configuration`
        opts.method = 'PUT'
        opts.body = {
            "enable": false,
            "enableEmailDigest": false
        }
        return call(opts)
    },
    clearAlerts: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/alerts/resolve'
        opts.method = 'POST'
        return call(opts)
    }
}
// PRISM CONTAINER FUNCTIONS
module.exports.container = {
    create: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/containers/'
        opts.method = 'POST'
        opts.body = {
            name: opts.containerName,
            storagePoolUuid: opts.storagePoolUUID
        }
        if(opts.compressionEnabled) {opts.body.compressionEnabled = true}
        if(opts.compressionDelayInSecs) {opts.body.compressionDelayInSecs = opts.compressionDelayInSecs}
        if(opts.fingerPrintOnWrite) {opts.body.fingerPrintOnWrite = 'ON'}
        if(opts.onDiskDedup) {opts.body.onDiskDedup = 'POST_PROCESS'}
        return call(opts)
    },
    datastores: {
        create: opts => {
            opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/containers/datastores/add_datastore'
            opts.method = 'POST'
            opts.body = {
                containerName: opts.containerName,
                datastoreName: opts.containerName,
                readOnly: false
            }
            if (opts.nodeIds) {opts.body.nodeIds = opts.nodeIds}
            return call(opts)
        },
        delete: opts => {
            opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/storage_containers/datastores/remove_datastore'
            opts.method = 'POST'
            opts.body = {
                datastore_name: opts.containerName
            }
            if (opts.nodeIds) {opts.body.node_ids = opts.nodeIds}
            return call(opts)
        },
        get: opts => {
            opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/storage_containers/datastores'
            opts.method = 'GET'
            return call(opts)
        }
    },
    delete: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/containers/' + opts.containerUUID + '?ignoreSmallFiles=true'
        opts.method = 'DELETE'
        return call(opts)
    },
    get: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/containers/'
        opts.method = 'GET'
        return call(opts)
    },
    getByName: opts => {
        opts.url = 'https://' + opts.ip + ':9440//PrismGateway/services/rest/v1/containers/?searchString=' + opts.containerName
        opts.method = 'GET'
        return call(opts)
    }
}
// PRISM EVENT FUNCTIONS
module.exports.event = {
    get: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/events/?startTimeInUsecs=' + opts.startTime
        opts.method = 'GET'
        return call(opts)
    }
}
// PRISM HOST FUNCTIONS
module.exports.host = {
    get: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/hosts/'
        opts.method = 'GET'
        return call(opts)
    },
    nics: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/hosts/' + opts.hostUUID + '/host_nics'
        opts.method = 'GET'
        return call(opts)
    }
}
// PRISM IMAGE FUNCTIONS
module.exports.image = {
    createDisk: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/images/'
        opts.method = 'POST'
        opts.body = {
            image_import_spec: {
                storage_container_name: opts.containerName,
                url: opts.imageUrl
            },
            image_type: 'DISK_IMAGE',
            name: opts.imageName
        }
        if (opts['annotation']) { opts.body.annotation = opts['annotation']}
        return call(opts)
    },
    createIso: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/images/'
        opts.method = 'POST'
        opts.body = {
            image_import_spec: {
                storage_container_name: opts.containerName,
                url: opts.imageUrl
            },
            image_type: 'ISO_IMAGE',
            name: opts.imageName
        }
        if (opts['annotation']) { opts.body.annotation = opts['annotation']}
        return call(opts)
    },
    get: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/images/' + opts.imageID + '/'
        opts.method = 'GET'
        return call(opts)
    },
    getAll: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/images/'
        opts.method = 'GET'
        return call(opts)
    }
}
// PRISM NETWORK FUNCTIONS
module.exports.networks = {
    create: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/networks/'
        opts.method = 'POST',
        opts.body = {
            name: opts.networkName,
            vlan_id: opts.vlanID
        }
        if (opts['annotation']) {opts.body.annotation = opts.annotation}
        return call(opts)
    },
    createIpamNetwork: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/networks/'
        opts.method = 'POST',
        opts.body = {
            name: opts.networkName,
            vlan_id: opts.vlanID,
            ip_config: {
                default_gateway: opts.defaultGateway,
                network_address: opts.networkAddress,
                prefix_length: opts.prefixLength,
                pool: [{range: opts.poolRangeStart + " " + opts.poolRangeEnd}]
            }
        }
        if (opts['annotation']) {opts.body.annotation = opts.annotation}
        if (opts['dhcpServerAddress']) {opts.body.ip_config.dhcp_server_address = opts.dhcpServerAddress}
        if (opts['dnsServer']) {
            opts.body.ip_config.dhcp_options = {
                domain_name_servers: opts.dnsServer
            }
        }
        return call(opts)
    },
    createIpamNetworkv08: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v0.8/networks/'
        opts.method = 'POST',
        opts.body = {
            name: opts.networkName,
            vlanId: opts.vlanID,
            ipConfig: {
                defaultGateway: opts.defaultGateway,
                networkAddress: opts.networkAddress,
                prefixLength: opts.prefixLength,
                pool: [{range: opts.poolRangeStart + " " + opts.poolRangeEnd}]
            }
        }
        if (opts['annotation']) {opts.body.annotation = opts.annotation}
        if (opts['dhcpServerAddress']) {opts.body.ipConfig.dhcpServerAddress = opts.dhcpServerAddress}
        if (opts['dnsServer']) {
            opts.body.ipConfig.dhcpOptions = {
                domainNameServers: opts.dnsServer
            }
        }
        return call(opts)
    },
    delete: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/networks/' + opts.networkUUID
        opts.method = 'DELETE'
        return call(opts)
    },
    get: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/networks/'
        opts.method = 'GET'
        return call(opts)
    },
    v08get: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v0.8/networks/'
        opts.method = 'GET'
        return call(opts)
    }
}
// PRISM PROTECTION DOMAIN FUNCTIONS
module.exports.protectionDomain = {
    delete: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/protection_domains/' + opts.protectionDomainName
        opts.method = 'DELETE'
        return call(opts)
    },
    get: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/protection_domains/?names=' + opts.protectionDomainName
        opts.method = 'GET'
        return call(opts)
    },
    create: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/protection_domains/'
        opts.method = 'POST'
        opts.body = {"value": opts.protectionDomainName}
        return call(opts)
    },
    pending_actions: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/protection_domains/pending_actions/?protection_domain_names=' + opts.protectionDomainName
        opts.method = 'GET'
        return call(opts)
    },
    protectVMs: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/protection_domains/' + opts.protectionDomainName + '/protect_vms'
        opts.method = 'POST'
        opts.body = {
            appConsistentSnapshots: false,
            uuids: opts.vmArray
        }
        if(opts['appConsistent']) {opts.body.appConsistentSnapshots = opts['appConsistent']}
        return call(opts)
    },
    restore: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/protection_domains/' + opts.protectionDomainName + '/restore_entities'
        opts.method = 'POST'
        opts.body = {
            snapshotId: opts.snapshotId,
            pathPrefix: null,
            vgNamePrefix: opts.namePrefix,
            vmNamePrefix: opts.namePrefix,
            vmNames: opts.vmNameArray,
            volumeGroupUuids: []
        }
       if(opts['replace'] == true) {opts.body.replace = true}
        return call(opts)
    },
    schedules: {
        create: opts => {
            let now = new Date()
            let offsetSeconds = now.getTimezoneOffset() * -60
            let nowMicroSecs = now.getTime() * 1000
            opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/protection_domains/' + opts.protectionDomainName + '/schedules'
            opts.method = 'POST'
            opts.body = {
                pdName: opts.protectionDomainName,
                type: 'DAILY',
                everyNth: 365,
                retentionPolicy: {
                    localMaxSnapshots: 3,
                    remoteMaxSnapshots: {}
                },
                appConsistent: false,
                userStartTimeInUsecs: nowMicroSecs,
                timezoneOffset: offsetSeconds
            }
            if(opts['appConsistent']) {opts.body.appConsistent = opts['appConsistent']}
            if(opts['hourly']) {opts.body.type = 'HOURLY'}
            if(opts['everyNth']) {opts.body.everyNth = opts['everyNth']}
            if(opts['localMaxSnapshots']) {opts.body.retentionPolicy.localMaxSnapshots = opts['localMaxSnapshots']}
            return call(opts)
        },
        delete: opts => {
            opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/protection_domains/' + opts.protectionDomainName + '/schedules'
            opts.method = 'DELETE'
            return call(opts)
        }
    },
    snapshots: {
        delete: opts => {
            opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/protection_domains/' + opts.protectionDomainName + '/dr_snapshots/' + opts.snapshotId
            opts.method = 'DELETE'
            return call(opts)
        },
        get: opts => {
            opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/protection_domains/' + opts.protectionDomainName + '/dr_snapshots/'
            opts.method = 'GET'
            return call(opts)
        }
    },
    unprotectVMs: opts => {
        opts.url = 'https://' + opts.ip + ':9440//PrismGateway/services/rest/v1/protection_domains/' + opts.protectionDomainName + '/unprotect_vms'
        opts.method = 'POST'
        return call(opts)
    }
}
// PRISM REMOTE SITE FUNCTIONS
module.exports.remoteSite = {
    delete: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/remote_sites/' + opts.remoteSiteID
        opts.method = 'DELETE'
        opts.body = opts.vmArray
        return call(opts)
    }
}
// SSP FUNCTIONS
module.exports.ssp = {
    images: {
        delete: opts => {
            opts.url = 'https://' + opts.ip + ':9440/api/nutanix/v3/images/' + opts.imageUUID
            opts.method = 'DELETE'
            return call(opts)
        },
        getByName: opts => {
            opts.url = 'https://' + opts.ip + ':9440/api/nutanix/v3/images/list'
            opts.method = 'POST'
            opts.body = {
                filter: 'name==' + opts.imageName
            }
            return call(opts)
        }
    },
    projects: {
        delete: opts => {
            opts.url = 'https://' + opts.ip + ':9440/api/nutanix/v3/projects/' + opts.projectUUID,
            opts.method = 'DELETE'
            return call(opts)
        },
        getByName: opts => {
            opts.url = 'https://' + opts.ip + ':9440/api/nutanix/v3/projects/list'
            opts.method = 'POST'
            opts.body = { filter: 'name==' + opts.projectName }
            return call(opts)
        }
    },
    roles: {
        delete: opts => {
            opts.url = 'https://' + opts.ip + ':9440/api/nutanix/v3/roles/' + opts.roleUUID
            opts.method = 'DELETE'
            return call(opts)
        },
        getByName: opts => {
            opts.passValue = opts.roleName
            opts.body = {
                filter: 'name==' + opts.roleName
            }
            opts.url = 'https://' + opts.ip + ':9440/api/nutanix/v3/roles/list'
            opts.method = 'POST'
            return call(opts)
        }
    }
}
// PRISM STORAGE POOL FUNCTIONS
module.exports.storagePool = {
    get: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/storage_pools/'
        opts.method = 'GET'
        return call(opts)
    },
    getByName: opts => {
        opts.url = `https://${opts.ip}:9440//PrismGateway/services/rest/v1/storage_pools/?searchString=${opts.storagePoolName}`
        opts.method = 'GET'
        return call(opts)
    },
    rename: opts => {
        opts.url = `https://${opts.ip}:9440/PrismGateway/services/rest/v1/storage_pools/`
        opts.method = 'PATCH'
        opts.body = {
            name: opts.name,
            storagePoolUuid: opts.storagePoolUuid
        }
        return call(opts)
    }
}
// PRISM TASK FUNCTIONS
module.exports.task = {
    get: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/tasks/' + opts.taskUUID + '/'
        opts.method = 'GET'
        return call(opts)
    },
    getAll: opts => {
        opts.body = { include_completed: true, include_subtasks_info: false }
        if (opts['type']) { opts.body.operation_type_list = opts.type }
        if (opts['startTime']) { opts.body.cut_off_time_usecs = opts.startTime }
        if (opts['includeCompleted']) { opts.body.include_completed = opts.includeCompleted }
        if (opts['includeSubTask']) { opts.body.include_subtasks_info = opts.includeSubTask }
        opts.url = 'https://' + opts.ip + ':9440/api/nutanix/v2.0/tasks/list'
        opts.method = 'POST'
        return call(opts)
    }
}
// PRISM VM FUNCTIONS
module.exports.vm = {
    addNics: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/vms/' + opts.vmUUID +'/nics/'
        opts.method = 'POST'
        if (opts.nicList && opts.nicList.length < 1)
            throw new Error("addNics requires at least one nic in opts.nicList")
        opts.body = {
            spec_list: []
        }
        for(let i=0; i< opts.nicList.length; i++) {
            opts.body.spec_list.push(opts.nicList[i])
        }
        return call(opts)
    },
    create: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/vms/'
        opts.method = 'POST'
        return call(opts)
    },
    delete: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/vms/' + opts.vmUUID +'/?delete_snapshots=true'
        opts.method = 'DELETE'
        return call(opts)
    },
    get: opts => {
        opts.url = `https://${opts.ip}:9440/PrismGateway/services/rest/v1/vms/`
        opts.method = 'GET'
        // e.g.: power_state==on;is_cvm==0
        if (opts.filterCriteria) {opts.url = `${opts.url}?filterCriteria=${opts.filterCriteria}`}
        return call(opts)
    },
    getByName: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/vms/?searchString=' + opts.vmName
        opts.method = 'GET'
        return call(opts)
    },
    getByUUID: opts => {
      opts.url = `https://${opts.ip}:9440/PrismGateway/services/rest/v2.0/vms/${opts.vmUUID}?include_vm_nic_config=${opts.includeNICs ? true : false}&include_vm_disk_config=${opts.includeDisks ? true : false}`,
      opts.method = 'GET'
      return call(opts)
    },
    diskAttach: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/vms/' + opts.vmUUID + '/disks/attach'
        opts.method = 'POST'
        let diskCount = 1
        if (opts['diskCount']) {diskCount = opts['diskCount']}
        let vmDisks = []
        for(let i=0; i<diskCount; i++) {
            let thisDisk = {
                is_cdrom: false,
                disk_address: {
                    device_bus: "scsi"
                },
                vm_disk_create: {
                    storage_container_uuid: opts.storageContainerUUID,
                    size: opts.diskSizeInBytes
                }
            }
            vmDisks.push(thisDisk)
        }
        opts.body = {vm_disks: vmDisks}
        return call(opts)
    },
    updateDisk: opts => {
      opts.url = `https://${opts.ip}:9440/PrismGateway/services/rest/v2.0/vms/${opts.vmUUID}/disks/update`
      opts.method = 'PUT'
      return call(opts)
    },
    start: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/vms/' + opts.vmUUID + '/set_power_state/'
        opts.method = 'POST'
        opts.body = { transition: 'ON' }
        if (opts['hostUUID']) {opts.body.host_uuid = opts['hostUUID']}
        return call(opts)
    },
    getNetwork: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/vms/' + opts.vmUUID + '/nics/?include_address_assignments=true'
        opts.method = 'GET'
        return call(opts)
    },
    restart: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/vms/' + opts.vmUUID + '/set_power_state/'
        opts.method = 'POST'
        opts.body = { transition: 'ACPI_REBOOT' }
        if (opts['hostUUID']) {opts.body.host_uuid = opts['hostUUID']}
        return call(opts)
    }
}
// PRISM VOLUME GROUP FUNCTIONS
module.exports.volumeGroup = {
    delete: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/volume_groups/' + opts.volumGroupUUID
        opts.method = 'DELETE'
        return call(opts)
    },
    get: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v2.0/volume_groups/'
        opts.method = 'GET'
        return call(opts)
    }
}
// PRISM CENTRAL DEPLOY FUNCTIONS
module.exports.prism_central = {
    getDeployableVersions: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/upgrade/prism_central_deploy/softwares',
        opts.method = 'GET'
        return call(opts)
    },
    deploy: opts => {
        opts.url = 'https://' + opts.ip + ':9440/api/nutanix/v3/prism_central'
        opts.method = 'POST'
        opts.body = {
            "resources": {
                "version": opts.pcVersion,
                "should_auto_register": false,
                "pc_vm_list": [
                    {
                        "vm_name": "RXAutomationPC",
                        "container_uuid": opts.containerUUID,
                        "num_sockets": opts.vCPU,
                        "data_disk_size_bytes": opts.diskSizeInBytes,
                        "memory_size_bytes": opts.memoryInBytes,
                        "dns_server_ip_list": [opts.nameserver],
                        "nic_list": [
                            {
                                "ip_list": [
                                    opts.pcIP
                                ],
                                "network_configuration": {
                                    "network_uuid": opts.networkUUID,
                                    "subnet_mask": opts.subnet_mask,
                                    "default_gateway": opts.defaultGateway
                                }
                            }
                        ]
                    }
                ]
            }
        }
        return call(opts)
    },
    register: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/multicluster/prism_central/register'
        opts.method = 'POST'
        opts.body = {
            "ipAddresses":[opts.pcIP],
            "username": opts.pcUsername || opts.creds.username,
            "password": opts.pcPassword,
            "port": 9440
        }
        return call(opts)
    },
    getMultiClusterState: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/multicluster/cluster_external_state'
        opts.method = 'GET'
        return call(opts)
    }
}
// PRISM UTIL FUNCTIONS
module.exports.util = {
    change_default_password: opts => {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/utils/change_default_system_password',
        opts.method = 'POST'
        opts.creds = {
            username: opts.username || opts.creds.username,
            password: 'Nutanix/4u'
        }
        opts.body = {
            oldPassword: 'Nutanix/4u',
            newPassword: opts.newPassword
        }
        return call(opts)
    }
}

// MANAGEMENT_SERVER FUNCTIONS
module.exports.management_servers = {
    register: opts=> {
        opts.url = 'https://' + opts.ip + ':9440/PrismGateway/services/rest/v1/management_servers/register',
        opts.method = 'POST',
        opts.body = {
            "adminUsername": opts.vcsa.username,
            "adminPassword": opts.vcsa.password,
            "ipAddress": opts.vcsa.ip,
            "port": "443"
        }
        return call(opts)
    }
}

/**
 * opts.transports = [{ "port": 161, "transport_protocol": "UDP" }]
 */
module.exports.snmp = {
    add_transport: opts => {
        opts.url = 'https://' + opts.ip + ':9440/api/nutanix/v2.0/snmp/add_transports'
        opts.method = 'POST'
        opts.body = [{ "port": opts.port, "transport_protocol": opts.transport_protocol }]
        return call(opts)
    },
    add_user: opts => {
        opts.url = 'https://' + opts.ip + ':9440/api/nutanix/v2.0/snmp/users'
        opts.method = 'POST'
        opts.body = {
            auth_key: opts.password,
            auth_type: 'SHA',
            priv_type: 'AES',
            priv_key: opts.key,
            username: opts.username
        }
        return call(opts)
    }
}

// CALL THE PRISM API
async function call(opts) {
    let response = await axios.request({
      auth: opts.creds,
      timeout: opts.timeout || 20000,
      httpsAgent: new https.Agent({rejectUnauthorized: false}),
      method: opts.method,
      url: opts.url,
      rejectUnauthorized: false,
      data: opts.body
    })
  
    return response.data
  }

  async function callv4(opts) {
    let response = await axios.request({
      auth: opts.creds,
      timeout: opts.timeout || 20000,
      httpsAgent: new https.Agent({rejectUnauthorized: false}),
      method: opts.method,
      url: opts.url,
      rejectUnauthorized: false,
      headers: {'If-Match':opts.etag},
      data: opts.body
    })
  
    return response.data
  }

async function postForm(opts, form) {
    let response = await axios.post(opts.url,form, {
        auth: opts.creds,
        timeout: opts.timeout || 20000,
        httpsAgent: new https.Agent({rejectUnauthorized: false}),
        url: opts.url,
        rejectUnauthorized: false,
    })

    return response.data
}
  
