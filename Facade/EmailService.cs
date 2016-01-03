﻿namespace forCrowd.WealthEconomy.Facade
{
    using Microsoft.AspNet.Identity;
    using System.Net.Mail;
    using System.Net.Mime;
    using System.Threading.Tasks;

    public class EmailService : IIdentityMessageService
    {
        public bool HasValidConfiguration()
        {
            var hasRegistrationEmailAddress = !string.IsNullOrWhiteSpace(Framework.AppSettings.RegistrationEmailAddress);

            var hasSmtpClientConfig = false;

            try
            {
                using (var smtpClient = new SmtpClient())
                {
                    hasSmtpClientConfig = !string.IsNullOrWhiteSpace(smtpClient.Host);
                }
            }
            catch
            {
                // Swallow it, it's going to return 'false' as a result, which is enough
            }

            return hasRegistrationEmailAddress && hasSmtpClientConfig;
        }

        public async Task SendAsync(IdentityMessage message)
        {
            // Validate
            // 1. Smtp configuration
            if (!HasValidConfiguration())
                return;

            var mailMessage = new MailMessage()
            {
                From = new MailAddress(Framework.AppSettings.RegistrationEmailAddress, "forCrowd Foundation")
            };

#if !DEBUG
            // To
            mailMessage.To.Add(new MailAddress(message.Destination));

            // Bcc
            if (!string.IsNullOrWhiteSpace(Framework.AppSettings.AlertEmailAddress))
                mailMessage.Bcc.Add(new MailAddress(Framework.AppSettings.AlertEmailAddress));
#else
            // To
            mailMessage.To.Add(new MailAddress(Framework.AppSettings.AlertEmailAddress));
#endif

            mailMessage.Subject = message.Subject;

            //var text = "A new member has been joined to our guid - Email: " + user.Email;
            //var html = @"<p>Good days sir,<br /><br />A new member has been joined to our guild.<br />Email: " + user.Email + ".<br /><br />Kind Regards,<br />forCrowd Foundation</p>";
            var text = message.Body;
            var html = message.Body;

            mailMessage.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(text, null, MediaTypeNames.Text.Plain));
            mailMessage.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(html, null, MediaTypeNames.Text.Html));

            using (var smtpClient = new SmtpClient())
            {
                //smtpClient.EnableSsl = true;
                await smtpClient.SendMailAsync(mailMessage);
            }
        }
   }
}