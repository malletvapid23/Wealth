﻿namespace forCrowd.WealthEconomy.Facade
{
    using BusinessObjects;
    using DataObjects;
    using Framework;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Data.Entity;
    using System.Text;
    using System.Threading.Tasks;

    public class UserManager : UserManager<User, int>
    {
        public UserManager() : base(new UserStore()) { }

        public UserManager(UserStore store)
            : base(store)
        {
        }

        internal new UserStore Store { get { return (UserStore)base.Store; } }

        public override async Task<IdentityResult> AddPasswordAsync(int userId, string password)
        {
            // Add password
            var result = await base.AddPasswordAsync(userId, password);

            if (result.Succeeded)
            {
                // Get user
                var user = await FindByIdAsync(userId);

                user.HasPassword = null;

                await Store.SaveChangesAsync();
            }

            return result;
        }

        public async Task AddSingleUseTokenAsync(User user)
        {
            Store.AddSingleUseToken(user);
            await Store.SaveChangesAsync();
        }

        public override async Task<IdentityResult> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var result = await base.ChangePasswordAsync(userId, currentPassword, newPassword);

            if (result.Succeeded)
            {
                await Store.SaveChangesAsync();
            }

            return result;
        }

        public async Task<IdentityResult> ChangeUserName(int userId, string userName)
        {
            var user = await base.FindByIdAsync(userId);

            user.UserName = userName;
            await Store.SaveChangesAsync();

            return IdentityResult.Success;
        }

        public override async Task<IdentityResult> ConfirmEmailAsync(int userId, string token)
        {
            var result = await base.ConfirmEmailAsync(userId, token);

            if (result.Succeeded)
            {
                await Store.SaveChangesAsync();
            }

            return result;
        }

        [Obsolete("Use CreateUser function with string clientAppUrl signature")]
        public override Task<IdentityResult> CreateAsync(User user, string password)
        {
            return base.CreateAsync(user, password);
        }

        /// <summary>
        /// Creates a regular local account
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <param name="clientAppUrl"></param>
        /// <returns></returns>
        public async Task<IdentityResult> CreateAsync(User user, string password, string clientAppUrl)
        {
            user.HasPassword = null;

            var result = await base.CreateAsync(user, password);

            if (result.Succeeded)
            {
                await Store.SaveChangesAsync();

                // Send confirmation email
                await SendConfirmationEmailAsync(user.Id, clientAppUrl);
            }

            return result;
        }

        /// <summary>
        /// Creates an account with external login and no password
        /// </summary>
        /// <param name="user"></param>
        /// <param name="userLoginInfo"></param>
        /// <returns></returns>
        public async Task<IdentityResult> CreateAsync(User user, UserLoginInfo userLoginInfo)
        {
            // Email confirmed
            user.EmailConfirmed = true;

            // Has password: Determines whether 'Add Password' or 'Change Password' option is available
            user.HasPassword = false;

            // Single use token: Since this is an external login, create single use token;
            // it's going to be used to retrieve the bearer token by the client
            user.SingleUseToken = Guid.NewGuid().ToString();

            var result = await base.CreateAsync(user);

            if (result.Succeeded)
            {
                await Store.AddLoginAsync(user, userLoginInfo);
                await Store.SaveChangesAsync();

                // Send notification email
                await SendNewExternalLoginNotificationEmailAsync(user.Id);
            }

            return result;
        }

        /// <summary>
        /// Creates an local anonymous account with auto generated email address and without a password
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<IdentityResult> CreateAnonymousAsync(User user)
        {
            // Has password: Determines whether 'Add Password' or 'Change Password' option is available
            user.HasPassword = false;

            // Single use token: Since this is an external login, create single use token;
            // it's going to be used to retrieve the bearer token by the client
            Store.AddSingleUseToken(user);

            var result = await base.CreateAsync(user);

            if (result.Succeeded)
            {
                await Store.SaveChangesAsync();

                // Send notification email
                await SendAnonymousLoginNotificationEmailAsync(user.Id);
            }

            return result;
        }

        public async Task DeleteUserResourcePoolAsync(int resourcePoolId)
        {
            await Store.DeleteUserResourcePoolAsync(resourcePoolId);
            await Store.SaveChangesAsync();
        }

        public async Task DeleteUserElementFieldAsync(int elementFieldId)
        {
            await Store.DeleteUserElementFieldAsync(elementFieldId);
            await Store.SaveChangesAsync();
        }

        public async Task DeleteUserElementCellAsync(int elementCellId)
        {
            await Store.DeleteUserElementCellAsync(elementCellId);
            await Store.SaveChangesAsync();
        }

        public async Task<User> FindBySingleUseTokenAsync(string token)
        {
            // Search for the user
            var entity = await Users.SingleOrDefaultAsync(user => user.SingleUseToken == token);

            // Return null if there is no..
            if (entity == null)
                return null;

            // Remove token
            entity.SingleUseToken = null;
            await Store.SaveChangesAsync();

            // Return the user
            return entity;
        }

        /// <summary>
        /// For testing purposes
        /// </summary>
        /// <returns></returns>
        public string GetUniqueEmail()
        {
            var year = DateTime.Now.Year;
            var month = DateTime.Now.Month;
            var day = DateTime.Now.Day;
            var hour = DateTime.Now.Hour;
            var minute = DateTime.Now.Minute;
            var second = DateTime.Now.Second;
            return "user_" + year + month + day + "_" + hour + minute + second + "@forcrowd.org";
        }

        public async Task<string> GetUniqueUserNameFromEmail(string email)
        {
            var emailUsername = email.Substring(0, email.IndexOf("@"));
            var userName = emailUsername;
            var count = 0;

            User user = null;
            do
            {
                if (count > 0) userName = emailUsername + count.ToString();
                user = await Store.FindByNameAsync(userName);
                count++;
            } while (user != null);

            return userName;
        }

        public async Task<IdentityResult> LinkLoginAsync(User user, UserLoginInfo userLoginInfo)
        {
            // Email confirmed
            user.EmailConfirmed = true;

            // Single use token: Since this is an external login, create single use token;
            // it's going to be used to retrieve the bearer token by the client
            user.SingleUseToken = Guid.NewGuid().ToString();

            var result = await base.AddLoginAsync(user.Id, userLoginInfo);

            if (result.Succeeded)
            {
                await Store.SaveChangesAsync();
            }

            return result;
        }

        public override async Task<IdentityResult> ResetPasswordAsync(int userId, string token, string newPassword)
        {
            var result = await base.ResetPasswordAsync(userId, token, newPassword);

            if (result.Succeeded)
            {
                await Store.SaveChangesAsync();
            }

            return result;
        }

        public async Task SendConfirmationEmailAsync(int userId, string clientAppUrl, bool resend = false)
        {
            var user = await base.FindByIdAsync(userId);

            var token = await base.GenerateEmailConfirmationTokenAsync(userId);
            var encodedToken = System.Net.WebUtility.UrlEncode(token);
            var confirmEmailUrl = string.Format("{0}/app/account/confirm-email;token={1}", clientAppUrl, encodedToken);

            var subject = "Confirm your email";
            if (resend) subject += " - Resend";

            var sbBody = new StringBuilder();
            sbBody.AppendLine("    <p>");
            sbBody.AppendLine("        <b>Wealth Economy - Confirm Your Email</b><br />");
            sbBody.AppendLine("        <br />");
            sbBody.AppendFormat("        Email: {0}<br />", user.Email);
            sbBody.AppendLine("        <br />");
            sbBody.AppendLine("        Please click the following link to confirm your email address<br />");
            sbBody.AppendFormat("        <a href='{0}'>Confirm your email address</a>", confirmEmailUrl);
            sbBody.AppendLine("    </p>");
            sbBody.AppendLine("    <p>");
            sbBody.AppendLine("        Thanks,<br />");
            sbBody.AppendLine("        forCrowd Foundation");
            sbBody.AppendLine("    </p>");

            await base.SendEmailAsync(userId, subject, sbBody.ToString());
        }

        public async Task SendResetPasswordEmailAsync(int userId, string clientAppUrl)
        {
            // TODO Validation email

            var user = await base.FindByIdAsync(userId);

            // TODO Validation user

            var token = await base.GeneratePasswordResetTokenAsync(userId);
            var encodedToken = System.Net.WebUtility.UrlEncode(token);
            var resetPasswordUrl = string.Format("{0}/app/account/reset-password;email={1};token={2}",
                clientAppUrl,
                user.Email,
                encodedToken);

            var subject = "Reset your password";

            var sbBody = new StringBuilder();
            sbBody.AppendLine("    <p>");
            sbBody.AppendLine("        <b>Wealth Economy - Reset Your Password</b><br />");
            sbBody.AppendLine("        <br />");
            sbBody.AppendFormat("        Username: {0}<br />", user.UserName);
            sbBody.AppendFormat("        Email: {0}<br />", user.Email);
            sbBody.AppendLine("        <br />");
            sbBody.AppendLine("        Please click the following link to reset your email password<br />");
            sbBody.AppendFormat("        <a href='{0}'>Reset your password</a>", resetPasswordUrl);
            sbBody.AppendLine("    </p>");
            sbBody.AppendLine("    <p>");
            sbBody.AppendLine("        Thanks,<br />");
            sbBody.AppendLine("        forCrowd Foundation");
            sbBody.AppendLine("    </p>");

            await base.SendEmailAsync(userId, subject, sbBody.ToString());
        }

        public async Task SendAnonymousLoginNotificationEmailAsync(int userId)
        {
            var subject = "New anonymous login";

            var user = await base.FindByIdAsync(userId);

            var sbBody = new StringBuilder();
            sbBody.AppendLine("    <p>");
            sbBody.AppendLine("        <b>Wealth Economy - New Anonymous Login</b><br />");
            sbBody.AppendLine("        <br />");
            sbBody.AppendFormat("        Email: {0}<br />", user.Email);
            sbBody.AppendLine("    </p>");
            sbBody.AppendLine("    <p>");
            sbBody.AppendLine("        Thanks,<br />");
            sbBody.AppendLine("        forCrowd Foundation");
            sbBody.AppendLine("    </p>");

            await base.SendEmailAsync(userId, subject, sbBody.ToString());
        }

        public async Task SendNewExternalLoginNotificationEmailAsync(int userId)
        {
            var subject = "New external login";

            var user = await base.FindByIdAsync(userId);

            var sbBody = new StringBuilder();
            sbBody.AppendLine("    <p>");
            sbBody.AppendLine("        <b>Wealth Economy - New External Login</b><br />");
            sbBody.AppendLine("        <br />");
            sbBody.AppendFormat("        Email: {0}<br />", user.Email);
            sbBody.AppendLine("    </p>");
            sbBody.AppendLine("    <p>");
            sbBody.AppendLine("        Thanks,<br />");
            sbBody.AppendLine("        forCrowd Foundation");
            sbBody.AppendLine("    </p>");

            await base.SendEmailAsync(userId, subject, sbBody.ToString());
        }

        [Obsolete("Use SetEmailAsync function with string clientAppUrl signature")]
        public override Task<IdentityResult> SetEmailAsync(int userId, string email)
        {
            return base.SetEmailAsync(userId, email);
        }

        public async Task<IdentityResult> SetEmailAsync(int userId, string email, string clientAppUrl)
        {
            var user = await FindByIdAsync(userId);

            user.IsAnonymous = false;
            var result = await base.SetEmailAsync(userId, email);

            if (result.Succeeded)
            {
                await Store.SaveChangesAsync();

                // Send confirmation email
                await SendConfirmationEmailAsync(userId, clientAppUrl);
            }

            return result;
        }
    }
}