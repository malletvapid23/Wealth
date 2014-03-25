﻿using Microsoft.Data.Edm;
using Microsoft.Data.Edm.Csdl;
using Microsoft.Data.Edm.Validation;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.EntityClient;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Xml;

namespace Framework
{
    /// <summary>
    /// DbContext extension that builds an "Entity Data Model" (EDM) from a <see cref="DbContext"/> created using Database First or Model First
    /// </summary>
    /// <remarks>
    /// To be able to support OData with Breeze, metadta of the DbContext needs to be published.
    /// Breeze has a package called EdmBuilder for this task, however it only works with DbContext created using Model First.
    /// This gist is creating the metadata from an Edmx file.
    /// Original url of this gist: https://gist.github.com/dariusclay/8673940
    /// 
    /// Breeze EdmBuilder package url: http://www.nuget.org/packages/Breeze.EdmBuilder/
    /// 
    /// Breeze EdmBuilder package remarks:
    /// We need the EDM both to define the Web API OData route and as a
    /// source of metadata for the Breeze client. 
    /// The Web API OData literature recommends the
    /// <see cref="System.Web.Http.OData.Builder.ODataConventionModelBuilder"/>.
    /// That component is suffient for route definition but fails as a source of 
    /// metadata for Breeze because (as of this writing) it neglects to include the
    /// foreign key definitions Breeze requires to maintain navigation properties
    /// of client-side JavaScript entities.
    /// <p>This EDM Builder ask the EF DbContext to supply the metadata which 
    /// satisfy both route definition and Breeze.</p>
    /// </remarks>
    public static class EdmModelBuilder
    {
        // Metadata pattern to find conceptual model name
        const string METADATACSDLPATTERN = "(\\w+\\.csdl)";

        public static IEdmModel GetModelFirstEdmModel<T>() where T : DbContext, new()
        {
            using (var csdlStream = GetCsdlStreamFromMetadata(new T()))
            {
                using (var reader = XmlReader.Create(csdlStream))
                {
                    IEdmModel model;
                    IEnumerable<EdmError> errors;
                    if (!CsdlReader.TryParse(new[] { reader }, out model, out errors))
                    {
                        foreach (var e in errors)
                            Debug.Fail(e.ErrorCode.ToString("F"), e.ErrorMessage);
                    }
                    return model;
                }
            }
        }

        static Stream GetCsdlStreamFromMetadata(IObjectContextAdapter context)
        {
            // Get connection string builder
            var connectionStringBuilder = new EntityConnectionStringBuilder(context.ObjectContext.Connection.ConnectionString);

            // Get the regex match from metadata property of the builder
            var match = Regex.Match(connectionStringBuilder.Metadata, METADATACSDLPATTERN);

            // Get the resource name
            var resourceName = match.Groups[0].Value;

            // Get context assembly
            var assembly = Assembly.GetAssembly(context.GetType());

            // Return the csdl resourcey
            return assembly.GetManifestResourceStream(resourceName);
        }

        /// <summary>
        /// Builds an "Entity Data Model" (EDM) from a <see cref="DbContext"/>
        /// </summary>
        /// <example>
        /// /* In the WebApiConfig.cs */
        /// using (var context = new TodoListContext())
        /// {
        ///   config.Routes.MapODataRoute(
        ///       routeName: "odata", 
        ///       routePrefix: "odata", 
        ///       model: context.GetEdm(), 
        ///       batchHandler: new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer)
        ///       );
        /// }
        /// </example>
        /// <param name="dbContext">The source <see cref="DbContext"/></param>
        /// <returns>An XML <see cref="IEdmModel"/> </returns>
        public static IEdmModel GetCodeFirstEdmModel(this DbContext dbContext)
        {
            using (var stream = new MemoryStream())
            {
                using (var writer = XmlWriter.Create(stream))
                {
                    System.Data.Entity.Infrastructure.EdmxWriter.WriteEdmx(dbContext, writer);
                }
                stream.Position = 0;
                using (var reader = XmlReader.Create(stream))
                {
                    return EdmxReader.Parse(reader);
                }
            }
        }
    }
}