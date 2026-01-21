import * as Yup from "yup";

export const signUpInitialValues = {
  name: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  communityName: "",
  description: "",
  urlSlug: "",
  location: "",
  zipcode: "",
  city: "",
  state: "",
  country: "United States",
  countryId: 233,
  stateId: "",
};

export const signupValidationSchema = Yup.object({
  firstName: Yup.string()
    .trim("First name cannot start or end with spaces")
    .min(3, "First name must contain at least 3 characters")
    .max(10, "First name must be 10 characters or less")
    .matches(/^[A-Za-z ]+$/, "First name must contain only letters and spaces")
    .required("First name is required"),
  lastName: Yup.string()
    .trim("Last name cannot start or end with spaces")
    .min(3, "Last name must contain at least 3 characters")
    .max(10, "Last name must be 10 characters or less")
    .matches(/^[A-Za-z ]+$/, "Last name must contain only letters and spaces")
    .required("Last name is required"),
  communityName: Yup.string()
    .trim("Community name cannot start or end with spaces")
    .min(3, "Community name must contain atleast 3 characters")
    .max(35, "Community name must be 35 characters or less")
    .required("Community name is required"),
  urlSlug: Yup.string()
    .trim("Slug can not start or end with spaces")
    .min(3, "Slug can not be less than 3 characters")
    .max(50, "Slug can not be more than 50 characters")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .required("Slug is required"),
  description: Yup.string()
    .trim("Description cannot start or end with spaces")
    .min(11, `Description can not be less than 11 characters`)
    .max(150, `Description can not be more than 150 characters`)
    .required("Description is required"),
  email: Yup.string()
    .trim("Email address can not start or end with spaces")
    .email("Invalid email address")
    .matches(
      /^(?![._-])([a-zA-Z0-9._%+-]{1,64})@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    )
    .matches(
      /^(?!.*[._-]{2,})(?!.*\.\.).*$/,
      "Email cannot contain consecutive special characters"
    )
    .required("Email address is required"),
  password: Yup.string()
    .trim("Password can not start or end with spaces")
    .min(8, "Password must be at least 8 characters")
    .max(25, "Password cannot be more than 25 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&^#_.-]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Confirm password is required"),
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
  profileImage: Yup.mixed().nullable(),
});
