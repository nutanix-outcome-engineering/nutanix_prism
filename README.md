# Nutanix Prism Rest API Consumption

This module is written simply to consume Prism API.  It should be noted it's far from complete and only added to on an "as needed" basis for projects.  If you would like to contribute, feel free.

# TO USE:

> var prism = require('nutanix_prism')

# THEN CONSUME BY CREATING AN OPTIONS OBJECT IE:

>     var opts = {
>         creds: {
>             username:'prismUsername',
>             password:'prismPassword'
>         }
>         ip: 'prismIP',
>         itemX: 'whateverElse'
>     }

# THEN CALL THE PRISM METHOD/FUNCTION YOU NEED:

>     prism.cluster.get(opts)
>     .then(successData => {
>         //handle success data
>         console.log(successData)
>     })
>     .catch(err => {
>         //handle failure data
>         console.log(err)
>     })

### Currently Supported Commands/Options

**NOTE:** All opts require opts.ip, and opts.creds that include username & password


----------


#### **CLUSTER**

    prism.cluster.get(opts)

#### **CONTAINERS**

    prism.container.create(opts)

**required:**  opts.storagePoolUUID, opts.containerName

**optional:** opts.compressionEnabled (true|false), opts.compressionDelayInSecs (integer), opts.fingerPrintOnWrite (true|false), opts.onDiskDedup (true|false)

    prism.container.delete(opts)

 **required:** opts.containerUUID

    prism.container.getByName(opts)

**required:** opts.containerName

#### **CONTAINER DATASTORES**

    prism.container.datastores(opts)

**required:** opts.containerName, opts.containerName, opts.nodeIds[]

    prism.container.datastores.delete(opts)

**required:** opts.containerName, opts.nodeIds[]

#### **EVENTS**

    prism.event.get(opts)

**required:** opts.startTime
    
#### **HOST**

    prism.host.get(opts)
.

    prism.host.nics(opts)

**required:**  opts.hostUUID

#### **IMAGES**

    prism.image.createDisk(opts)

**required:**  opts.containerName, opts.imageUrl, opts.imageName

**optional:**  opts.annotation

    prism.image.createIso(opts)

**required:**  opts.containerName, opts.imageUrl, opts.imageName

**optional:**  opts.annotation

    prism.image.get(opts)

**required:** opts.imageID

#### **NETWORKING**

    prism.networks.create(opts)
    
**required:** opts.networkName, opts.vlanID

**optional:** opts.annotation

    prism.networks.delete(opts)

**required:** opts.networkUUID

    prism.networks.get(opts)

#### **PROTECTION DOMAINS**
    prism.protectionDomain.create(opts)

**required:** opts.protectionDomainName

    prism.protectionDomain.delete(opts)

**required:** opts.protectionDomainName

    prism.protectionDomain.get(opts)

**required:** opts.protectionDomainName

    prism.protectionDomain.schedules.delete(opts)

**required:** opts.protectionDomainName

    prism.protectionDomain.snapshots.delete(opts)

**required:** opts.protectionDomainName, opts.snapshotId

    prism.protectionDomain.snapshots.get(opts)

**required:** opts.protectionDomainName

    prism.protectionDomain.unprotectVMs(opts)

**required:** opts.protectionDomainName
    
#### **REMOTE SITES**

    prism.remoteSite.delete(opts)

**required:** opts.remoteSiteID, opts.vmArray[]
    
#### **SSP**

    prism.ssp.images.delete(opts)

**required:** opts.imageUUID

    prism.ssp.images.getByName(opts)

**required:** opts.imageName

    prism.ssp.images.projects(opts)

**required:** opts.projectUUID

    prism.ssp.getByName(opts)

**required:** opts.projectName 

    prism.ssp.roles.delete(opts)

**required:** opts.roleUUID

    prism.ssp.roles.getByName(opts)

**required:** opts.roleName, opts.roleName
    

#### **STORAGE POOLS**

    prism.storagePool.get(opts)

#### **TASKS**

    prism.task.get(opts)

**required:** opts.taskUUID

    prism.task.getAll(opts)

**optional:** opts.startTime (usecs Number), opts.type (operation type Array [string, string]), opts.includeCompleted (boolean default: true), includeSubTask (boolean default: false)

#### **VMs**

    prism.vm.create(opts)

**required:** opts.body // Full Body Syntax for creating VM

    prism.vm.delete(opts)

**required:** opts.vmUUID

    prism.vm.get(opts)
.

    prism.vm.getByName(opts)

**required:** opts.vmName

    prism.vm.start(opts)

**required:** opts.vmUUID

    prism.vm.getNetwork(opts)

**required:** opts.vmUUID

#### **VOLUME GROUPS**

    prism.volumeGroup.delete(opts)

**required:** opts.volumGroupUUID

    prism.volumeGroup.get(opts)