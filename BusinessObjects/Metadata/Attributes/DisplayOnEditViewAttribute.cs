﻿using System;

namespace BusinessObjects.Metadata.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class DisplayOnEditViewAttribute : Attribute
    {
        public DisplayOnEditViewAttribute(bool value)
        {
            Value = value;
        }

        public bool Value { get; private set; }
    }
}
