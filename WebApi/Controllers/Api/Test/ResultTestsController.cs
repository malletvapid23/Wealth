﻿namespace forCrowd.WealthEconomy.WebApi.Controllers.Api.Test
{
    using System;
    using System.Net;
    using System.Web.Http;

    /// <summary>
    /// A dummy controller to test some functions and results
    /// </summary>
    [AllowAnonymous]
    [RoutePrefix("api/ResultTests")]
    public class ResultTestsController : BaseApiController
    {
        [Route("BadRequestResult")]
        [HttpPost]
        public IHttpActionResult BadRequestResult()
        {
            return BadRequest();
        }

        [Route("BadRequestMessageResult")]
        [HttpPost]
        public IHttpActionResult BadRequestMessageResult()
        {
            return BadRequest("test");
        }

        [Route("ConflictResult")]
        [HttpPost]
        public IHttpActionResult ConflictResult()
        {
            return this.Conflict();
        }

        [Route("ExceptionResult")]
        [HttpPost]
        public void ExceptionResult()
        {
            throw new Exception("test");
        }

        [Route("InternalServerErrorResult")]
        [HttpPost]
        public IHttpActionResult InternalServerErrorResult()
        {
            return InternalServerError(new Exception("test"));
        }

        [Route("ModelStateErrorResult")]
        [HttpPost]
        public IHttpActionResult ModelStateErrorResult()
        {
            ModelState.AddModelError("key", "value");
            return BadRequest(ModelState);
        }

        [Route("NoContentResult")]
        [HttpGet]
        public IHttpActionResult GetNoContentResult()
        {
            return StatusCode(HttpStatusCode.NoContent);
        }

        [Route("NoContentResult")]
        [HttpPost]
        public IHttpActionResult PostNoContentResult()
        {
            return StatusCode(HttpStatusCode.NoContent);
        }

        [Route("NotFoundResult")]
        [HttpPost]
        public IHttpActionResult NotFoundResultResult()
        {
            return NotFound();
        }

        [Route("OkResult")]
        [HttpGet]
        public IHttpActionResult GetOkResult(string message)
        {
            return Ok(message);
        }

        [Route("OkResult")]
        [HttpPost]
        public IHttpActionResult PostOkResult([FromBody] OkResultModel model)
        {
            return Ok(model.message);
        }

        [Route("UnauthorizedResult")]
        [HttpPost]
        public IHttpActionResult UnauthorizedResult()
        {
            return Unauthorized();
        }
    }

    public class OkResultModel
    {
        public string message = "";
    }
}
