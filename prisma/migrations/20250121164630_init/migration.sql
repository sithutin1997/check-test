-- CreateTable
CREATE TABLE `GitHubStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NULL,
    `indicator` VARCHAR(191) NULL,
    `componentName` VARCHAR(191) NULL,
    `componentStatus` VARCHAR(191) NULL,
    `incidentImpact` VARCHAR(191) NULL,
    `incidentName` VARCHAR(191) NULL,
    `incidentStatus` VARCHAR(191) NULL,
    `maintenanceImpact` VARCHAR(191) NULL,
    `maintenanceName` VARCHAR(191) NULL,
    `maintenanceStatus` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
