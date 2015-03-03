namespace DataObjects.Migrations
{
    using BusinessObjects;
    using DataObjects;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;

    internal sealed class DbMigrationsConfiguration : DbMigrationsConfiguration<WealthEconomyContext>
    {
        readonly IEnumerable<string> pendingMigrations;

        public DbMigrationsConfiguration()
        {
            ContextKey = "WealthEconomyContext";
            AutomaticMigrationsEnabled = false;

            // Get the migrations
            var migrator = new DbMigrator(this);
            pendingMigrations = migrator.GetPendingMigrations();
        }

        protected override void Seed(WealthEconomyContext context)
        {
            // Initial data
            // TODO Why the code below didn't work on live server?
            DatabaseInitializer.SeedInitialData(context);

            //// Data per migration
            //foreach (var migration in pendingMigrations)
            //{
            //    // Get the version number
            //    var migrationVersion = migration.Substring(migration.IndexOf("_") + 1);

            //    switch (migrationVersion)
            //    {
            //        case "V0_14_9_M": // Currently the initial migration
            //            {
            //                // Initial data
            //                DatabaseInitializer.SeedInitialData(context);
            //                break;
            //            }
            //    }
            //}
        }
    }
}
