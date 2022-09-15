/*3 tables for dropdown values*/
CREATE TABLE IF NOT EXISTS `People` (
    `personID` int(8) NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `surname` TEXT NOT NULL,
        PRIMARY KEY (`personID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7;

CREATE TABLE IF NOT EXISTS `Devices` (
    `deviceID` int(8) NOT NULL AUTO_INCREMENT,
    `device_type` TEXT NOT NULL,
        PRIMARY KEY (`deviceID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5;

CREATE TABLE IF NOT EXISTS `Operating_systems` (
    `osID` int(8) NOT NULL AUTO_INCREMENT,
    `os_type` TEXT NOT NULL,
        PRIMARY KEY (`osID`)
 ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10;



/*main table to store assigned assets tags data*/
CREATE TABLE IF NOT EXISTS `Assigned_asset_tags` (
    `assigmentID` int(8) NOT NULL AUTO_INCREMENT,
    `asset_tag` TEXT NOT NULL,
    `personID` int(8) NOT NULL,
    `date_bought` DATE NOT NULL,
    `date_decommissioned` DATE,
    `deviceID` int(8) NOT NULL,
    `osID` int(8) NOT NULL,
        PRIMARY KEY (`assigmentID`),
        FOREIGN KEY (`personID`) REFERENCES People(`personID`),
        FOREIGN KEY (`deviceID`) REFERENCES Devices(`deviceID`),
        FOREIGN KEY (`osID`) REFERENCES Operating_systems(`osID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5;



/*Populate tables with some initial data*/
INSERT INTO `People` (`personID`, `name`, `surname`) VALUES
    (1, 'Jane', 'Doe'),
    (2, 'Maria', 'Anders'),
    (3, 'Antonio', 'Moreno'),
    (4, 'Christina', 'Berglund'),
    (5, 'Thomas', 'Hardy'),
    (6, 'Victoria', 'Ashworth');


INSERT INTO `Devices` (`deviceID`, `device_type`) VALUES
    (1, 'PC'),
    (2, 'Mobile'),
    (3, 'Laptop'),
    (4, 'Tablet');


INSERT INTO `Operating_systems` (`osID`, `os_type`) VALUES
    (1, 'Android'),
    (2, 'macOS'),
    (3, 'iOS'),
    (4, 'Windows 10'),
    (5, 'Windows 7'),
    (6, 'Windows 11'),
    (7, 'Linux'),
    (8, 'Ubuntu'),
    (9, 'Unix');


/*Populate tables with some initial data*/
INSERT INTO `Assigned_asset_tags` (`assigmentID`, `asset_tag`, `personID`, `date_bought`, `date_decommissioned`, `deviceID`, `osID`) VALUES
    (1, '55.969656:n3.164780-PC-01', 4, '2011-11-11', '2018-02-04', 1, 5),
    (2, '55.861611:n4.263097-Mobile-02', 1, '2020-01-25', NULL, 2, 1),
    (3, '51.502834:n0.134126-Laptop-03', 6, '2021-05-12', '2022-07-01', 3, 2),
    (4, '51.502834:n0.134126-Mobile-04', 6, '2021-07-24', '2022-01-30', 2, 3);


/*Notes*/
/* 
asset tag location component explained:
'55.969656:n3.164780-PC-01' --> 55.969656:n3.164780 = location

location is made up of 2 values that are separate with ':'. They indicate longitude and latitute in format used by google maps. Since those value can be negative (to distinguish west from east and north from south), the minus sign should be converted to letter 'n'. This will preserve the format of asset tag that is made up of 3 components and which are divided with '-' dash sign (location-deviceType-ID).
*/