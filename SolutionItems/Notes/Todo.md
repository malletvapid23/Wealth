﻿# Todo

## Short Term

### Functional

* Prepare resource pool view  
UserResourcePool view recursive selectedElementItem part
* Work on the samples again  
Update configuration.cs withelement fields  
employee + customer + quality index samples are not there  
all in one sample is outdated  
* Check userunitofwork + resourcepoolunitofwork + userresourcepoolunitofwork for sample records + delete cases
* Work on the chapters again  
* Initial (fixed) amount for resource pool
* Make even the name as a element item and create it automatically when the element is created
* Currently multiplier + resource pool field types can only be added once per element (or resource pool) - check it again
* ResourcePoolIndex can be a field for elementfield table? Index boolean?
* Element parent + child structure
* ismainelement -> DefaultElement  
* multiplier field type -> userelementcell can hold just the value but will be used as it is, not it's average (like Rating)
currently number of sales is not on user level, but on elementitem level!
* userelementcell rating -> value?
* instead of MainElement boolean on Element level, can it be done with MainElement field on ResourcePool level? yes, with InverseProperty
* subtotals; sales price, sales price incl. tax, number of sales, total tax, total sales price incl. tax, total income
* userelementcell ratings + counts?
* display index's own ratings + counts?

### Technical

* user.issample field? + web.config         <add key="SampleUserId" value="2" />
* db tables -> [x]set?
* Merge Asp.Net Identity models with into the context
* Unit testing for controllers + unitofwork etc.?
* autofac or ninject or windsor or unity or spring?
check the websites  
http://www.dimecasts.net/Casts/ByTag/Ninject  
unitofwork taking dbcontext as a parameter in the constructor case? passing an initialized context, is it safe at all?  
check asp.net identity as a sample  
* dbcontext -> aanmeldencontext -> resourcepoolmanager?
* generic dbset to resourcepoolrepository?
* remove repositories?
* azure websites?
* separate web into webclient / webservice
* cors;  
http://www.dotnetcurry.com/showarticle.aspx?ID=921  
http://msdn.microsoft.com/en-us/magazine/dn532203.aspx  
http://www.asp.net/web-api/overview/security/enabling-cross-origin-requests-in-web-api  
* javascript logging; http://jsnlog.com/
* automapper?
* highcharts library loading perf?
* vs update 2 + 3 changes?
* asp.net identity  
http://blogs.msdn.com/b/webdev/archive/2014/03/20/test-announcing-rtm-of-asp-net-identity-2-0-0.aspx  
http://typecastexception.com/post/2014/04/20/ASPNET-Identity-20-Setting-Up-Account-Validation-and-Two-Factor-Authorization.aspx  
http://www.codeproject.com/Articles/823263/ASP-NET-Identity-Introduction-to-Working-with-Iden  
merge user + identityuser tables -> appuser, approle etc.? - Change Primary Key for Users in ASP.NET Identity
* what happened to appveyor?
* add multiple fields test
* check [required] attribute for newer classes?
* try to convert other batch files to ps scripts as well
* elmah for glimpse?

## Long Term

### Functional

* default license ratings should be 50/50 and ratings total should always be 100%?
* create sample data with average ratingvalue? or make the rating nullable  
* exclude sample user from rating averages - or make them always 50 / 50?  
* how to calculate average index? some people may enter 1,2,3 - some may enter 100,200,300? always force them to enter percentage?  
or always calculate the total average based on invidiuals percentage? or both?
* in 'not rated index' case, userResourcePool view doesn't show the result
* in'not rated organizations' case, it's collecting the tax but not giving it back? - basically how to treat an organization that doesn't have any rating?

### Technical

* When creating resourcepool is gives tons of errors but then does the operation and says ok in UI?!

* breeze - check save + has + get + reject changes  
currently they don't work on entity level? - also prepareBatch method?

* sometimes cancel button doesn't allow to go back (fill required?)  
use history.back sort of method, but first vm needs to be a new object, without createEntity

* learn how and when to use disposable thingy?  
repo + unitofwork + context + controllers?

* handling concurrency can be improved  
load the new record and let the user choose which one is correct  

* try to create initial data (seed) from facade, instead of dataobjects layer  

* check whether unit of work classes need merging  
however, in the current structure, every entity will have a unitofwork + controller by default?  
be careful about different contexts entities - license.resourcepool = sampleResourcePool was creating new resource pools!  
either work with Ids, or try to work on merging unitofwork classes  

* multiple pk cases for user element + user resource pool organization + resource pool organization  
* table structure - by this way, userresourcepool could reach to ratings/values easily;  
User - Resourcepool - UserresourcepoolId  
UserResourcePoolElementCell -> UserResourcePoolId ElementCellId?  

* authorize only for admins didnt work - resourcepool etc.?
any user should be able to access them but only the owners and admins can update them?  
according to this, normal user may not use post action for instance? check these rules later on  

* implement soft delete
* exists should work with find or alllive.any() or all.any()?  
* find vs deleted records? - findlive? or don't retrieve dead records at all?
* don't allow delete License if it's connected to an Organization (can't be deleted) - same goes for the others but License really can't be deleted
* loading animation? both for breeze + angular  
[nprogress](http://ricostacruz.com/nprogress/) ?
* enum data type didnt work with odata? or api?
* html cache break - angular scripts + views etc.?
* using texbox to update chart data didn't work, it breaks the chart?
* use or try to remove scripts.render() + styles.render() from layout.cshtml - then mvc can be removed completely
* automate .tt scripts with afterbuild?
* try to have a standard for css usage + html layout formats + also js script conventions
* check spelling of the texts!
* enable auto test for appveyor - currently it fails probably because it can't create the db?
* __migrationhistory createdon field error - it seems there is not much to do, it also might be about glimpse?
* upgrade to .net 4.5.1?  
http://msdn.microsoft.com/en-us/library/hh925568%28v=vs.110%29.aspx
* what to do these lines; datacontext.js - batches.push(manager.getEntities(['License'], [breeze.EntityState.Deleted]));
* code contracts?
* Install-Package DynamicQuery?
* http://www.hanselman.com/blog/crossbrowserdebuggingintegratedintovisualstudiowithbrowserstack.aspx
* https://www.runscope.com/signup
* html minifier: https://github.com/deanhume/html-minifier
* Install-Package Microsoft.AspNet.WebApi.HelpPage
* karma js tester?
* web api throttling!
* http://smtp4dev.codeplex.com/
* request validation -> html agility pack?
* web.config httpcompression?
* coded ui test or canopy or ..? web iu testers?
* object level validation IValidatableObject
* http://www.postsharp.net/aspects#examples
* Generalizing Validation via Custom Validation Filter Attribute -> general filter for ModelState.IsValid check! http://www.dotnetcurry.com/showarticle.aspx?ID=927
* validateantiforgerytoken + bind attributes in odata controller?
* [Route("users/{id:int:min(1)}")] ?
* template pattern for elementfield + fieldtype classes!
* calling saveChanges in dispose of unitofwork?
* extend dbcontext validation errors - check spaanjaars sample and use them in webapp with modelstate blocks?
* result of datetime (ticks) index is bit useless? need reference a start or end date as a reference?

* try turning off lazy loading - then how it brings the data (resourcepool for instance?)  
currently there seem no good case that lazy loading is beneficial?
and how about disabling proxy classes? what will be the difference exactly?

* find method  
public IEnumerable[t] FindBy(System.Linq.Expressions.Expression[func[T, bool]] predicate)  
{ IEnumerable[T] query = _dbset.Where(predicate).AsEnumerable();
return query; }

* odata4  
odata4 upgrade was failed; breeze doesn't support it yet!  
http://damienbod.wordpress.com/2014/06/10/getting-started-with-web-api-and-odata-v4/  
http://blogs.msdn.com/b/webdev/archive/2013/11/01/introducing-batch-support-in-web-api-and-web-api-odata.aspx  

* odata - paging (also filters?)  
querayable vs enablequerysupport  
[Queryable(PageSize=10)]  
var queryAttribute = new QueryableAttribute() { AllowedQueryOptions = AllowedQueryOptions.Top | AllowedQueryOptions.Skip, MaxTop = 100 };
config.EnableQuerySupport(queryAttribute);  

* http client for testing?  
private async void btnGet_Click(object sender, EventArgs e)  
{  
CustomHandlerA chA = new CustomHandlerA();
CustomHandlerB chB = new CustomHandlerB();
HttpClient client = HttpClientFactory.Create(chA, chB);  

client.BaseAddress = new Uri("http://localhost:15324/");  
client.DefaultRequestHeaders.Accept.Clear();  
client.DefaultRequestHeaders.Accept.Add(  
new MediaTypeWithQualityHeaderValue("application/json"));  

HttpResponseMessage response = await client.GetAsync("api/car");  
if (response.IsSuccessStatusCode)  
{  
Car[] myCarArray = await response.Content.ReadAsAsync[Car[]]();  
foreach (Car myCar in myCarArray)  
{  
txtResults.AppendText(string.Format("{0}\t {1}\t {2}\n\n", myCar.Id, myCar.Make,
myCar.Model));  
}  
}  
}

* one to one relation;  
{  
[Key, ForeignKey("Player")]  
public long PlayerId { get; set; }  
public virtual Player Player { get; set; }  
}  

* composite key definition;  

[Key]
[Column(Order = 0)]  
public int LocationID { get; set; }  

[Key]  
[Column(Order = 1)]  
public int DayID { get; set; }  

[Key]  
[Column(Order = 2)]  
public intTimeID { get; set; }  

[Key]  
[Column(Order = 3)]  
public string LanguageID { get; set; }  

### Misc - Unsorted

check the latest updates in general
try to create simple tests, especially for userstore & usermanager!

if these are okay, identity + userunitofwork merge could be finished?
continue with the next item!

compare the current stuff with update3 templates!
usercontrollers don't work?
odata patch?
.tt files reaction?

. invalid model state error !
. getuserinfo fails but no error?
. account edit doesn't work (probably user edit as well)

Update 3
. dbcontext.create?
. usermanager - owin parts?

. only bearer token?
// Configure Web API to use only bearer token authentication.
config.SuppressDefaultHostAuthentication();
config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

sessionStorage?

http://www.asp.net/web-api/overview/security/preventing-cross-site-request-forgery-(csrf)-attacks
