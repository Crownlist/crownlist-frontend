import {
  AddOnServiceFormData,
  AddOnServiceErrors,
} from "@/types/addon-services";

export const validateAddOnServiceForm = (
  form: AddOnServiceFormData
): AddOnServiceErrors => {
  const errors: AddOnServiceErrors = {};

  if (!form.name?.trim()) {
    errors.name = "Name is required";
  } else if (form.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  } else if (form.name.trim().length > 80) {
    errors.name = "Name must be at most 80 characters";
  }

  if (!form.category?.trim()) {
    errors.category = "Category is required";
  } else if (form.category.trim().length < 3) {
    errors.category = "Category must be at least 3 characters";
  } else if (form.category.trim().length > 80) {
    errors.category = "Category must be at most 80 characters";
  }

  const descriptionWords = form.description
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  if (!form.description?.trim()) {
    errors.description = "Description is required";
  } else if (descriptionWords.length < 10) {
    errors.description = "Description must be at least 10 words";
  } else if (descriptionWords.length > 1000) {
    errors.description = "Description must be at most 1000 words";
  }

  if (
    form.amount === null ||
    form.amount === undefined ||
    isNaN(Number(form.amount)) ||
    Number(form.amount) <= 0
  ) {
    errors.amount = "Amount must be greater than 0";
  }

  if (!form.billing_cycle) {
    errors.billing_cycle = "Billing cycle is required";
  }

  if (!form.billing_type) {
    errors.billing_type = "Billing type is required";
  }

  if (!form.status) {
    errors.status = "Status is required";
  }

  return errors;
};

export const hasValidationErrors = (errors: AddOnServiceErrors): boolean => {
  return Object.keys(errors).length > 0;
};
