import * as Yup from "yup";

export const communityInitialValue = {
  name: "",
  urlSlug: "",
  description: "",
  location: "",
  zipcode: "",
  city: "",
  state: "",
  country: "United States",
  countryId: 233,
  stateId: "",
};

export const communitySchema = Yup.object({
  name: Yup.string()
    .min(3, "Community name must contain at least 3 characters")
    .max(35, "Community name must be 35 characters or less")
    .required("Community name is required"),
  urlSlug: Yup.string()
    .min(3, "Community slug can not be less than 3 characters")
    .max(50, "Community slug can not be more than 50 characters")
    .matches(
      /^[a-z0-9-]+$/,
      "Community slug can only contain lowercase letters, numbers, and hyphens"
    )
    .required("Community slug is required"),
  description: Yup.string()
    .min(11, `Description can not be less than 11 characters`)
    .max(150, `Description can not be more than 150 characters`)
    .required("Community description is required"),
  location: Yup.string()
    .trim("Address can not start or end with spaces")
    .min(1, "Address can not be less than 1 character")
    .max(30, "Address can not be more than 30 characters")
    .required("Please enter your location"),

  zipcode: Yup.string()
    .trim("Zip code can not start or end with spaces")
    .matches(/^[A-Za-z0-9\- ]{4,10}$/, "Please enter a valid zip code")
    .required("Enter your zip code"),

  city: Yup.string().required("Enter your city"),
  state: Yup.string().required("Enter your state"),
  country: Yup.string().required("Enter your country"),
});
