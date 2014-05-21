﻿using System.Web.Http;
using System.Web.Http.OData.Batch;

namespace Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // This is already on?
            //config.EnableQuerySupport();

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            var edm = Facade.Utility.GetWealthEconomyContextEdm();

            // OData routes
            config.Routes.MapODataRoute(
                routeName: "ODataRoute",
                routePrefix: "odata",
                model: edm,
                batchHandler: new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer));
        }
    }
}
