﻿using System;
using System.Web.Http;
using Web.Results;

namespace Web.Controllers.Api.Test
{
    /// <summary>
    /// A dummy controller to test IHttpAction results 
    /// </summary>
    [AllowAnonymous]
    [RoutePrefix("api/Results")]
    public class ResultsController : BaseApiController
    {
        [Route("OkResult")]
        [HttpGet]
        public IHttpActionResult OkResult()
        {
            return Ok();
        }

        [Route("UnauthorizedResult")]
        [HttpGet]
        public IHttpActionResult UnauthorizedResult()
        {
            return Unauthorized();
        }

        [Route("InternalServerErrorResult")]
        [HttpGet]
        public IHttpActionResult InternalServerErrorResult()
        {
            return new InternalServerErrorResult(Request);
        }

        [Route("SomeException")]
        [HttpGet]
        public void SomeException()
        {
            throw new InvalidOperationException("Result test");
        }
    }
}
