﻿namespace Web.Models
{
    // Models returned by AccountController actions.

    public class UserInfoViewModel
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public bool IsAdmin { get; set; }
    }
}
