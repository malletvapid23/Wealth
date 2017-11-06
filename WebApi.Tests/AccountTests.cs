﻿using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace forCrowd.WealthEconomy.WebApi.Tests
{
    [TestClass]
    public class AccountTests
    {
        [TestMethod]
        public void TestMethod1()
        {
            var email = $"user_{DateTime.Now:yyyyMMdd_HHmmssfff}@forcrowd.org";
            var password = "Password@123";
            var registerResult = Register(email, password);

            Console.WriteLine("Registration Status Code: {0}", registerResult);

            //string token = GetToken(email, password);
            var token = GetTokenDictionary(email, password);
            Console.WriteLine("");
            Console.WriteLine("Access Token:");
            Console.WriteLine(token);

            // Write each item in the dictionary out to the console:
            foreach (var kvp in token)
            {
                Console.WriteLine("{0}: {1}", kvp.Key, kvp.Value);
            }

            Console.WriteLine("");

            Console.WriteLine("Getting User Info:");
            Console.WriteLine(GetCurrentUser(token["access_token"]));
        }

        private string Register(string email, string password)
        {
            var registerModel = new
            {
                Email = email,
                Password = password,
                ConfirmPassword = password
            };
            using (var client = new HttpClient())
            {
                var response =
                    client.PostAsJsonAsync(
                    "http://localhost:15001/api/Account/Register",
                    registerModel).Result;
                return response.StatusCode.ToString();
            }
        }

        private string GetToken(string email, string password)
        {
            var pairs = new List<KeyValuePair<string, string>>
                        {
                            new KeyValuePair<string, string>( "grant_type", "password" ), 
                            new KeyValuePair<string, string>( "username", email ), 
                            new KeyValuePair<string, string> ( "Password", password )
                        };
            var content = new FormUrlEncodedContent(pairs);
            using (var client = new HttpClient())
            {
                var response =
                    client.PostAsync("http://localhost:15001/api/Token", content).Result;
                return response.Content.ReadAsStringAsync().Result;
            }
        }

        private Dictionary<string, string> GetTokenDictionary(
            string userName, string password)
        {
            var pairs = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>( "grant_type", "password" ), 
                    new KeyValuePair<string, string>( "username", userName ), 
                    new KeyValuePair<string, string> ( "Password", password )
                };
            var content = new FormUrlEncodedContent(pairs);

            using (var client = new HttpClient())
            {
                var response =
                    client.PostAsync("http://localhost:15001/api/Token", content).Result;
                var result = response.Content.ReadAsStringAsync().Result;

                // Deserialize the JSON into a Dictionary<string, string>
                var tokenDictionary =
                    JsonConvert.DeserializeObject<Dictionary<string, string>>(result);
                return tokenDictionary;
            }
        }

        [Obsolete("Account UserInfo is not in use anymore")]
        private static string GetCurrentUser(string token)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                var response = client.GetAsync("http://localhost:15001/api/Account/UserInfo").Result;
                return response.Content.ReadAsStringAsync().Result;
            }
        }
    }
}
