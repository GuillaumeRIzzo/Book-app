using MailKit.Net.Smtp;
using MimeKit;

namespace API.Services
{
    public class MailKitEmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public MailKitEmailService(IConfiguration config)
        {
            _config = config ?? throw new ArgumentNullException(nameof(config));
        }

        public async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_config["EMAIL_FROM"]));
            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = htmlBody };
            message.Body = bodyBuilder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_config["EMAIL_SMTP_HOST"], int.Parse(_config["EMAIL_SMTP_PORT"]), true);
            await smtp.AuthenticateAsync(_config["EMAIL_SMTP_USER"], _config["EMAIL_SMTP_PASS"]);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
    }
}
