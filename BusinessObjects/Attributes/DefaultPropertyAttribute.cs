﻿using System;

namespace BusinessObjects.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class DefaultPropertyAttribute : Attribute
    {
        public DefaultPropertyAttribute(string value)
        {
            Value = value;
        }

        public string Value { get; private set; }
    }
}
