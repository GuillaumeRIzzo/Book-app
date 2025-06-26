using Microsoft.AspNetCore.Authorization;

namespace API.Identity
{
    [AttributeUsage(AttributeTargets.Method| AttributeTargets.Class, AllowMultiple = true, Inherited = true)]
    public class RequiresCustomClaimAttribute : AuthorizeAttribute, IAuthorizationRequirement
    {
        public RequiresCustomClaimAttribute(params string[] claims)
        {
            Claims = claims;
        }

        public string[] Claims { get; }
    }
}
