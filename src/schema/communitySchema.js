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

export const communitySchema = (t) =>
  Yup.object({
    name: Yup.string()
      .min(3, t("communitiesPage.addCommunity.errors.name.min"))
      .max(35, t("communitiesPage.addCommunity.errors.name.max"))
      .required(t("communitiesPage.addCommunity.errors.name.required")),

    urlSlug: Yup.string()
      .min(3, t("communitiesPage.addCommunity.errors.urlSlug.min"))
      .max(50, t("communitiesPage.addCommunity.errors.urlSlug.max"))
      .matches(
        /^[a-z0-9-]+$/,
        t("communitiesPage.addCommunity.errors.urlSlug.invalid"),
      )
      .required(t("communitiesPage.addCommunity.errors.urlSlug.required")),

    description: Yup.string()
      .min(11, t("communitiesPage.addCommunity.errors.description.min"))
      .max(150, t("communitiesPage.addCommunity.errors.description.max"))
      .required(t("communitiesPage.addCommunity.errors.description.required")),

    location: Yup.string()
      .trim(t("communitiesPage.addCommunity.errors.location.trim"))
      .min(1, t("communitiesPage.addCommunity.errors.location.min"))
      .max(30, t("communitiesPage.addCommunity.errors.location.max"))
      .required(t("communitiesPage.addCommunity.errors.location.required")),

    zipcode: Yup.string()
      .trim(t("communitiesPage.addCommunity.errors.zipcode.trim"))
      .matches(
        /^[A-Za-z0-9\- ]{4,10}$/,
        t("communitiesPage.addCommunity.errors.zipcode.invalid"),
      )
      .required(t("communitiesPage.addCommunity.errors.zipcode.required")),

    city: Yup.string().required(
      t("communitiesPage.addCommunity.errors.city.required"),
    ),

    state: Yup.string().required(
      t("communitiesPage.addCommunity.errors.state.required"),
    ),

    country: Yup.string().required(
      t("communitiesPage.addCommunity.errors.country.required"),
    ),
  });
