﻿using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home ";
            
            return View();
        }
    }
}
