# Wealth Economy

An experimental resource management system that aims to provide a sustainable economic system.

---

### Release Notes
**0.11.9**
* TotalCostIndex calculation is now based on Profit, instead of Sales Price
* Sample data values were updated (.25 vs .75)
* All in One sample was re-enabled
* Sample user was created and sample data moved under this account
* UserResourcePool pages subtotals were fixed
* ODataController.tt fine-tuning

**0.11.8**
* UserResurcePoolCustom api controller was created and special methods moved to this controller from OData
* New UserResourcePool save failed issue was fixed

**0.11.7**
* UnitOfWork methods are now saving the changes at the end. Save method is not public anymore
* DecreaseNumberOfSales method was implemented
* SectorChart page only shows Sector resource pool related data + negative values fix
* DataObjects.Tests project was removed
* tt output files were removed from Web project's publish output

**0.11.6**
* Cascase delete option enabled
* Sample child records will be added when creating a new ResourcePool, Sector, License, Organization, User ResourcePool entities

**0.11.5**
* Database seed method was updated to add sample records
* UserUnitOfWork insert method was synced with latest updates
* Initial admin password updated

**0.11.4**
* 'Definition controllers are only accessible to admins' rule didn't work, removed. Check this later on.

**0.11.3**
* UserResourcePoolEdit page fix

**0.11.2**
* ResourcePoolId field was removed from Organization table

**0.11.1**
* README.md and Release Notes.txt files merged

**0.11**
* HighCharts implementation: SectorChart page

**0.10.9**
* T4 files update to use IdentityContext
  * Dependencies folder was created under Framework - T4 folder, that contains IdentityContext libraries
* EntityFramework.dll + EntityFramework.SqlServer.dll files under  
C:\Program Files (x86)\Microsoft Visual Studio 12.0\Common7\IDE folder  
were replaced with Entity Framework 6.1 versions.

**0.10.8**
* MSBuild and IISExpress script files were created
* UserAccountType.cs file and its references were removed
* WealthEconomyContext and AspNetIdentityContext were merged
* Initial admin role + user + password

**0.10.7**
* breeze.js - metadataReady method in dataContext

**0.10.6**
* Concurrency check - RowVersion field was added to all entities and in ODataController it does a concurrency check for Patch operation

**0.10.5**
* routing fixes
  * if it's supported, angular html5Mode is on
  * href fixes
  * mvc routing always goes to HomeController, so angular can handle the requests

**0.10.4**
* glimpse nuget package - only for development environment for now
* Thanks to glimpse, <clear /> line was added to connectionstrings section in config files

**0.10.3**
* Nuget package updates

**0.10.2**
* Register + ChangePassword pages

**0.10.1**
* Session state related files + codes were removed
* Password, UserAccountTypeId fields were removed from User table
* Alterations folder was removed from SolutionItems
* Authorization filter was added to all Api controllers, Register action in AccountController was set to AllowAnonymous
* Administrator role was introduced - All definition Controller were put under "Administrator" role except "User" controller
* BaseController was created and ODataController.tt was modified to create BaseEntityControllers
* CodeTemplates folder was removed

**0.10.0**
* Asp.Net Identity

**0.9.2**
* BusinessObjects
  * Merge generated and custom classes
  * BaseEntity class
  * Clean up + finetuning
* Framework - T4 files fixes

**0.9.1**
* BusinessObjects - StringLength attributes

**0.9**
* Application
  * Converted to Code First approach from Database First
    * T4 files were updated to read from Code First metadata
    * EF6.Utility.cs was moved to the solution
  * Switched to LocalDb instead of SQL Server 2008 R2
  * T4 include files are now under Framework\T4 folder

**0.8.1**
* Web - Cleaning up the old mvc controllers + views etc.

**0.8**
* Database
  * ResourcePool table became the main container for Organization, License and Sector tables
  * UserResourcePoolOrganization was dropped and UserOrganization was introduced

**0.7**
* SPA with OData + AngularJS + Breeze.js + toastr.js
* Database - Sector table Id field switched to smallint from byte
* Solution - Refactoring tt files
* Solution - nuget package updates

**0.6.3**
* Web - Overview text update

**0.6.2**
* Web - Overview text update

**0.6.1**
* BusinessObjects - Required attribute for Dto classes

**0.6**
* Facade - UnitOfWork finetuning
* General - Password for User table + basic authentication
* Web - Controller.tt was created

**0.5**
* SolutionItems - Local_UpdateDatabase.sql was updated to remove doktrosizlar db items
* Business + DataObjects
  * To support tables with multiple primary key, IEntity interface Id property was replaced with IsNew
* Web - Controllers finetuning

**0.4.2**.2
* General - Missing files were restored - attempt #2

**0.4.2**.1
* General - Missing files were restored

**0.4.2**
* General - github repo merge

**0.4.1**
* General - Release Notes.txt was updated

**0.4**
* DataObjects
  * Utility.ttinclude: Common code blocks from t4 files were moved to this file
  * Repositories were updated
* BusinessObjects
  * Metadata.t4 was moved under "Generated" folder and was modified to generated the files for once.
* Facade
  * UnitOfWork classes were created for each entity
* Web
  * Repositories + UnitOfWork updates
* General
  * config files connectionstrings were updated
  * github repository reset

**0.3**
* BusinessObjects
  * OrganizationGroupType was renamed to UserResourcePoolType
  * UserDistributionIndexRatingAverage class was merged into UserResourcePool
  * BusinessObjectsDto.t4 was add to be able create Dto classes
  * OrganizationGroupType was renamed to UserResourcePoolType
* Web
  * Number of ratings info was added to CMRP views
  * Create / Edit operations were modified to use Dto classes
* Database + General
  * UserResourcePool table ResourcePoolRate field percentage update - values were divided to 100

**0.2**
* Database + General
  * ResourcePool + ResourcePoolOrganization + UserResourcePool + UserResourcePoolOrganization tables were added
  * User table ResourcePoolRate was removed
  * UserDistributionIndexRating table was removed
  * UserOrganizationRating table was removed
* General - Versioning method was updated: Minor version number will be increased in every update

**0.1.9**.1 - 06 Mar '14
* Web + SolutionItems - Minor description text update

**0.1.9** - 06 Mar '14
* SolutionItems - Maintenance scripts
* Database
  * Organization table UserId + NumberOfSales fields were removed
  * UserOrganizationRating table NumberOfSales field was added
  * All tables CreatedOn + ModifiedOn default values
* Web
  * Quality Private + Public views
  * Sector Private + Public views
  * Employee Satisfaction Private + Public views
  * Customer Satisfaction Private + Public views
  * All in One Private + Public views

**0.1.8** - 04 Mar '14
* General - User Notes field
* General - User account type + web menu items visibility based on the type
* Web - ServerMode + DevelopmentModeConfig for auto login
* Web - Knowledge Index Private + Public views

**0.1.6** - 19 Feb '14
* Database - Organization table UserId field: To solve "Increase + Reset Number of Sales" issue, organizations are now under users
* Web - UserController Create method generates sample data for the new user
* Web - ResourcePool views are now listing user's organizations

**0.1.5** - 01 Feb '14
* Web - Distance Index
* Web - Edit user back button fix
* Minor fixes + updates

**0.1.4** - 31 Jan '14
* Database - User table ResourcePoolRate field
* Web - Login + logout + edit user
* Web - All In One view

**0.1.3** - 29 Jan '14
* Web - CMRP Reports
* Web - Menu update

**0.1.2** - 28 Jan '14
* DataObjects - Organization - NumberOfSales field added
* Web - CMRPReport + Total Cost Index calculations
* Web - Home + menu updates

**0.1.1** - 24 Jan '14
* .gittattributes file
* Initial solution commit
* Update README.md
* Initial commit
