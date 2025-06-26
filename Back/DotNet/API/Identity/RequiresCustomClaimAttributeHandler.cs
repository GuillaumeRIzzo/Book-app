using Microsoft.AspNetCore.Authorization;

namespace API.Identity
{
    public class RequiresCustomClaimAttributeHandler : AuthorizationHandler<RequiresCustomClaimAttribute>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, RequiresCustomClaimAttribute requirement)
        {
            var user = context.User;

            if (user == null)
            {
                return Task.CompletedTask;
            }

            foreach (var claim in requirement.Claims)
            {
                if (user.HasClaim(c => c.Type == claim))
                {
                    context.Succeed(requirement);
                    return Task.CompletedTask;
                }
            }

            return Task.CompletedTask;
        }
    }

}
