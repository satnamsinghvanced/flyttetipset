/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { saveUserData } from "@/services/api-call/submit-form-service";
import { getSelectedForm } from "@/services/form/get-selected-form";
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Textarea
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import CustomRadioGroup from "./CustomRadioGroup";

interface FormField {
  _id: string;
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  visible?: boolean;
  defaultValue?: any;
  accept?: string; // For file inputs
  maxSize?: number; // For file inputs (in MB)
}

interface FormStep {
  _id: string;
  stepTitle: string;
  stepOrder: number;
  fields: FormField[];
  visible?: boolean;
}

interface FormData {
  _id?: string;
  formName: string;
  description: string;
  steps: FormStep[];
}

interface FormSelectItem {
  _id: string;
  formDescription: string;
  formTitle: string;
  [key: string]: any;
}

interface SelectedForm {
  id: string;
  title: string;
  formData: FormData | null;
  loading: boolean;
  error: string | null;
  step: number;
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

const DefaultRadioGroup = ({
  field,
  value,
  isInvalid,
  error,
  onChange,
}: any) => {
  const errorId = `${field.name}-error`;
  return (
    <div className="space-y-2">
      <label className="font-medium">
        {field.label} {field.required && "*"}
      </label>
      {isInvalid && error && (
        <p id={errorId} className="text-danger text-sm">
          {error}
        </p>
      )}
      <div
        className="flex flex-col gap-2"
        role="radiogroup"
        aria-required={field.required}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? errorId : undefined}
      >
        {Array.isArray(field.options) &&
          field.options?.map((opt: string, optIndex: number) => (
            <div key={`${field._id}-${optIndex}`} className="flex items-center">
              <input
                type="radio"
                id={`${field._id}-${optIndex}`}
                name={field.name}
                value={opt}
                checked={value === opt}
                onChange={(e) => onChange(e.target.value)}
                className={`mr-2 ${isInvalid ? "border-danger" : ""}`}
              />
              <label htmlFor={`${field._id}-${optIndex}`} className="text-sm">
                {opt}
              </label>
            </div>
          ))}
      </div>
    </div>
  );
};

const SubmissionResult = ({
  companyFound,
  partnerNames = [] as string[],
}: {
  companyFound: boolean;
  partnerNames?: string[];
}) => (
  <div className="rounded-xl shadow-md p-8 bg-background max-w-xl mx-auto flex flex-col gap-6">
    <div className="justify-center flex">
      {companyFound ? (
        <FaRegCircleCheck className="text-formsteps text-[96px]" />
      ) : (
        <FaRegCircleXmark className="text-red-500 text-[96px]" />
      )}
    </div>
    <h3 className="text-[32px] font-semibold leading-10">
      {companyFound
        ? `Vi har sendt din henvendelse til (${partnerNames})`
        : "OBS: Vi klarte dessverre ikke å finne noen relevante aktører for deg denne gangen. Du er velkommen til å prøve igjen ved senere anledning."}
    </h3>
    {companyFound && (
      <>
        <p className="font-normal text-base">
          Det tar kontakt innen 1-3 dager, og det er viktig at du sjekker
          søppelpost eller tar telefonen om ukjente nummer ringer.
        </p>
        <p className="text-2xl font-semibold text-secondary">
          Det er ikke alltid pris er det viktigste, men det er viktig at du
          velger en aktør som forstår ditt behov.
        </p>
      </>
    )}
  </div>
);

// Custom component for form selection
const FormSelectionField = ({
  formSelect,
  selectedForms = [`${formSelect[0]._id}`],
  onSelect,
  error,
  isInvalid,
  touched,
  isMultiSelectMode = false,
}: {
  formSelect: FormSelectItem[];
  selectedForms: string[];
  onSelect: (formId: string) => void;
  error?: string;
  isInvalid?: boolean;
  touched?: boolean;
  isMultiSelectMode?: boolean;
}) => {
  return (
    <div className="space-y-2">
      {/* <label className="font-medium">
        {isMultiSelectMode ? "Select Forms (Choose Multiple)" : "Select Form Type"} *
      </label> */}
      {isInvalid && error && touched && (
        <p className="text-danger text-sm">{error}</p>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3.5 w-full mb-8">
        {formSelect?.map((form: FormSelectItem) => {
          const isSelected = selectedForms.includes(form._id);

          return (
            <button
              key={form._id}
              type="button"
              className={`p-4 sm:p-6 rounded-lg transition-all duration-300 text-sm font-medium shadow-sm w-full flex gap-2 flex-col justify-start items-start min-h-[138px] ${isSelected
                ? "bg-primary/20 text-primary"
                : "bg-white text-primary"
                } ${isInvalid && touched ? "border-danger" : ""}`}
              onClick={() => onSelect(form._id)}
            >
              <div className="font-semibold text-2xl w-full text-start">
                {" "}
                {form.formTitle}
              </div>
              <div className="font-normal text-base text-secondary leading-5 w-full max-w-[188px] text-start">
                {" "}
                {form.formDescription}
              </div>
            </button>
          );
        })}
      </div>
      {isMultiSelectMode && selectedForms.length > 0 && (
        <div className="text-sm text-secondary mt-2 space-y-1">
          <p>
            Valgt: {selectedForms.length} form
            {selectedForms.length !== 1 ? "s" : ""}
          </p>
          {selectedForms.length > 1 && (
            <p className="text-xs">Klikk på et valgt skjema for å fjerne det</p>
          )}
        </div>
      )}
    </div>
  );
};

const Form = ({
  formSelect,
  isMultiSelect,
  pageTitle,
  pageDescription,
  privacyText,
}: {
  formSelect: FormSelectItem[];
  isMultiSelect: boolean;
  pageTitle: string;
  pageDescription: string;
  privacyText: string;
}) => {
  const [selectedForms, setSelectedForms] = useState<SelectedForm[]>([]);
  const [currentFormIndex, setCurrentFormIndex] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [companyFound, setCompanyFound] = useState(false);
  const [companyNotFound, setCompanyNotFound] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFirstFormLoading, setIsFirstFormLoading] = useState<boolean>(false);
  const [isMultiSelectMode] = useState<boolean>(isMultiSelect);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const hideMessageBox = () => {
    setIsError(false);
  };
  // Initialize with first form selection
  useEffect(() => {
    if (formSelect && formSelect.length > 0 && selectedForms.length === 0) {
      const firstFormId = formSelect[0]._id;
      const firstFormTitle = formSelect[0].formTitle;

      // Add first form to selected forms
      const newSelectedForm: SelectedForm = {
        id: firstFormId,
        title: firstFormTitle,
        formData: null,
        loading: false,
        error: null,
        step: 0,
        values: {
          selectedFormType: firstFormId,
          selectedFormTitle: firstFormTitle,
        },
        errors: {},
        touched: {},
      };

      setSelectedForms([newSelectedForm]);

      // Load the first form data in background
      loadFormData(0, firstFormId);
    }
  }, [formSelect]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const message =
        "Er du sikker på at du vil dra? Forespørselen din om eiendommen er ikke sendt inn, og alle detaljer vil gå tapt.";
      e.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep, currentFormIndex]);

  const loadFormData = async (index: number, formId: string) => {
    // Update loading state for this form
    setSelectedForms((prev) =>
      prev?.map((form, i) =>
        i === index ? { ...form, loading: true, error: null } : form
      )
    );

    if (index === 0 && selectedForms.length === 1) {
      setIsFirstFormLoading(true);
    }

    try {
      const data = await getSelectedForm(formId);
      // console.log(`Fetched form data for ${formId}:`, data);

      // Update form data for this form
      setSelectedForms((prev) =>
        prev?.map((form, i) =>
          i === index
            ? {
              ...form,
              formData: data,
              loading: false,
              step: 0, // Reset to step 0 when form loads
            }
            : form
        )
      );
    } catch (error: any) {
      console.error("Error fetching form:", error);

      // Update error state for this form
      setSelectedForms((prev) =>
        prev?.map((form, i) =>
          i === index
            ? {
              ...form,
              error:
                error.message || "Failed to load form. Please try again.",
              loading: false,
            }
            : form
        )
      );
    } finally {
      if (index === 0 && selectedForms.length === 1) {
        setIsFirstFormLoading(false);
      }
    }
  };

  const handleFormSelect = async (formId: string) => {
    // Check if form is already selected
    const existingIndex = selectedForms.findIndex((f) => f.id === formId);

    if (existingIndex >= 0) {
      // If multi-select is enabled and not the last form, allow removal
      if (isMultiSelectMode && selectedForms.length > 1) {
        // Remove form from selection
        const newSelectedForms = selectedForms.filter((f) => f.id !== formId);
        setSelectedForms(newSelectedForms);

        // Update current form index if needed
        if (currentFormIndex >= newSelectedForms.length) {
          setCurrentFormIndex(Math.max(0, newSelectedForms.length - 1));
        }
      }
      return;
    }

    // Add new form to selection
    const formTitle = formSelect.find((f) => f._id === formId)?.formTitle || "";
    const newSelectedForm: SelectedForm = {
      id: formId,
      title: formTitle,
      formData: null,
      loading: false,
      error: null,
      step: 0,
      values: {
        selectedFormType: formId,
        selectedFormTitle: formTitle,
      },
      errors: {},
      touched: {},
    };

    const newSelectedForms = isMultiSelectMode
      ? [...selectedForms, newSelectedForm]
      : [newSelectedForm]; // Single select mode replaces existing

    setSelectedForms(newSelectedForms);

    // Set current form to the newly added form
    setCurrentFormIndex(newSelectedForms.length - 1);

    // Load the form data
    loadFormData(newSelectedForms.length - 1, formId);
  };

  const currentForm = selectedForms[currentFormIndex];
  const currentFormData = currentForm?.formData;
  const currentStepData = currentFormData?.steps?.[currentStep];

  // Get visible steps for current form
  const getVisibleSteps = (form: SelectedForm) => {
    if (!form?.formData?.steps) return [];

    return form.formData.steps
      .filter((s: FormStep) => s.visible !== false && s.fields?.length > 0)
      .sort(
        (a: FormStep, b: FormStep) => (a.stepOrder || 0) - (b.stepOrder || 0)
      );
  };

  const visibleSteps = getVisibleSteps(currentForm);

  const validateField = useCallback(
    (name: string, value: any, field: FormField, formIndex: number): string => {
      if (field.required) {
        if (field.name === "phone" && value?.replace(/^\+47/, "")?.length !== 8) {
          return `${field.label} skal være 8 sifre`;
        } else if (field.name === "postalCode" && value?.length !== 4) {
          return `${field.label} skal være 4 sifre`;
        } else if (
          field.type === "checkbox" &&
          Array.isArray(field.options) &&
          field.options.length > 0
        ) {
          if (!value || (Array.isArray(value) && value.length === 0)) {
            return `${field.label} skal være valgt`;
          }
        } else if (field.type === "checkbox") {
          if (value !== true) {
            return `${field.label} Er påkrevd`;
          }
        } else if (field.type === "file") {
          if (!value || (Array.isArray(value) && value.length === 0)) {
            return `${field.label} Er påkrevd`;
          }
        } else if (!value || value.toString().trim() === "") {
          return `${field.label} Er påkrevd`;
        }
      }
      if (value && value.toString().trim() !== "") {
        const sanitizedValue = value.toString().trim();

        switch (field.type) {
          case "email":
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(sanitizedValue)) {
              return "Vennligst skriv inn en gyldig e-postadresse";
            }
            break;
          case "number":
            const numberRegex = /^[0-9+-\s]+$/;
            if (!numberRegex.test(sanitizedValue)) {
              return "Vennligst skriv bare inn tall";
            }
            break;
          case "tel":
          case "phone":
            const digitsOnly = sanitizedValue.replace(/[\s-]/g, "");
            const norwegianPhoneRegex = /^\d{8}$/;

            if (!norwegianPhoneRegex.test(digitsOnly)) {
              return "Telefonnummeret må være 8 sifre (f.eks. 12345678)";
            }
            break;
          case "file":
            if (Array.isArray(value) && field.maxSize) {
              const maxSizeBytes = field.maxSize * 1024 * 1024; // Convert MB to bytes
              const oversizedFiles = value.filter(
                (file: File) => file.size > maxSizeBytes
              );
              if (oversizedFiles.length > 0) {
                return `Fil(er) overskrider maksimal størrelse på ${field.maxSize}MB`;
              }
            }
            break;
        }
      }

      return "";
    },
    []
  );

  const handleChange = useCallback(
    (formIndex: number, name: string, value: any, field: FormField) => {
      setSelectedForms((prev) =>
        prev?.map((form, i) => {
          if (i !== formIndex) return form;

          const newValues = { ...form.values, [name]: value };

          const error = validateField(name, value, field, formIndex);
          const newErrors = error
            ? { ...form.errors, [name]: error }
            : Object.fromEntries(
              Object.entries(form.errors).filter(([key]) => key !== name)
            );

          return { ...form, values: newValues, errors: newErrors };
        })
      );
    },
    [validateField]
  );

  const handleBlur = useCallback(
    (formIndex: number, name: string, value: any, field: FormField) => {
      setSelectedForms((prev) =>
        prev?.map((form, i) => {
          if (i !== formIndex) return form;

          const newTouched = { ...form.touched, [name]: true };
          const error = validateField(name, value, field, formIndex);
          const newErrors = error
            ? { ...form.errors, [name]: error }
            : form.errors;

          return { ...form, touched: newTouched, errors: newErrors };
        })
      );
    },
    [validateField]
  );

  const validateCurrentStep = (): boolean => {
    if (!currentStepData) return true;

    const stepErrors: Record<string, string> = {};
    let isValid = true;

    const processField = (field: FormField) => {
      const value = currentForm.values[field.name];
      const error = validateField(field.name, value, field, currentFormIndex);
      if (error) {
        stepErrors[field.name] = error;
        isValid = false;
      }

      // Update touched
      setSelectedForms((prev) =>
        prev?.map((form, i) =>
          i === currentFormIndex
            ? { ...form, touched: { ...form.touched, [field.name]: true } }
            : form
        )
      );
    };

    currentStepData.fields
      ?.filter((field: FormField) => field.visible !== false)
      .forEach((field: FormField) => {
        if (
          field.name === "address" &&
          field.type === "text" &&
          field.required
        ) {
          // Handle address fields specially
          const streetField: FormField = {
            ...field,
            name: "streetName",
            label: "Street Name",
          };
          const postalField: FormField = {
            ...field,
            name: "postalCode",
            label: "Postal Code",
          };

          const streetError = validateField(
            streetField.name,
            currentForm.values[streetField.name],
            streetField,
            currentFormIndex
          );
          if (streetError) {
            stepErrors[streetField.name] = streetError;
            isValid = false;
          }

          const postalError = validateField(
            postalField.name,
            currentForm.values[postalField.name],
            postalField,
            currentFormIndex
          );
          if (postalError) {
            stepErrors[postalField.name] = postalError;
            isValid = false;
          }

          // Update touched for address fields
          setSelectedForms((prev) =>
            prev?.map((form, i) =>
              i === currentFormIndex
                ? {
                  ...form,
                  touched: {
                    ...form.touched,
                    [streetField.name]: true,
                    [postalField.name]: true,
                  },
                }
                : form
            )
          );
        } else if (field.name !== "address") {
          processField(field);
        }
      });

    // Update errors for current form
    setSelectedForms((prev) =>
      prev?.map((form, i) =>
        i === currentFormIndex
          ? { ...form, errors: { ...form.errors, ...stepErrors } }
          : form
      )
    );

    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < visibleSteps.length - 1) {
        // Move to next step in current form
        setCurrentStep((prev) => prev + 1);
      } else {
        // If this is the last step of current form
        if (isMultiSelectMode && currentFormIndex < selectedForms.length - 1) {
          // Move to next form, reset to step 0
          setCurrentFormIndex((prev) => prev + 1);
          setCurrentStep(0);
        } else {
          // Submit all forms
          handleFormSubmit();
        }
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      // Move to previous step in current form
      setCurrentStep((prev) => prev - 1);
    } else if (isMultiSelectMode && currentFormIndex > 0) {
      // Move to previous form, set to its last step
      setCurrentFormIndex((prev) => prev - 1);
      const prevFormVisibleSteps = getVisibleSteps(
        selectedForms[currentFormIndex - 1]
      );
      setCurrentStep(prevFormVisibleSteps.length - 1);
    }
  };
  const [partnerNames, setPartnerNames] = useState<string[]>([]);
  const handleFormSubmit = async () => {
    try {
      setSubmitLoading(true);
      // Create separate objects for each form
      const formSubmissions = selectedForms?.map((form) => ({
        formId: form.id,
        formTitle: form?.title,
        values: form.values,
      }));

      // Submit all forms as separate objects
      const res = await saveUserData(formSubmissions);
      console.log("Submission result:", res);
      console.log("Submission result:", res.status); // Complete for success

      const { success, isValidationError } = res;

      if (isValidationError || !success) {
        setIsError(true);
        setErrorMessage(res.message);
        setTimeout(() => {
          setIsError(false);
        }, 10000);
        return;
      }
      if (res.status === "Complete") {
        setCompanyFound(true);
        const partnerNames = res.partners?.map((p: any) => p.name).join(", ");

        // Save partner names in state
        setPartnerNames(partnerNames);

        //  setPartnerNames(res.partners || []);
        return;
      }
      setCompanyNotFound(true);
    } catch (error: any) {
      console.log("form submission error: ", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9+-\s]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleFileChange = (
    formIndex: number,
    fieldName: string,
    files: FileList | null,
    field: FormField
  ) => {
    if (!files || files.length === 0) {
      handleChange(formIndex, fieldName, null, field);
      return;
    }

    const fileArray = Array.from(files);
    handleChange(formIndex, fieldName, fileArray, field);
  };

  const renderField = (field: FormField, index: number, formIndex: number) => {
    const currentFormData = selectedForms[formIndex];
    const isInvalid =
      currentFormData?.touched[field.name] &&
      !!currentFormData?.errors[field.name];
    const value = currentFormData?.values[field.name] || "";

    const fieldProps = {
      key: `${field._id}-${formIndex}-${index}`,
      type: field.type,
      label: `${field.label}${field.required ? " *" : ""}`,
      placeholder: field.placeholder || " ",
      required: field.required,
      labelPlacement: "outside" as const,
      value: value,
      errorMessage: isInvalid ? currentFormData?.errors[field.name] : undefined,
      isInvalid: isInvalid,
      onBlur: () => handleBlur(formIndex, field.name, value, field),
    };

    const { key, ...restOfProps } = fieldProps;

    // Handle file input
    if (field.type === "file") {
      return (
        <div key={key} className="space-y-2 ">
          <label className="font-medium">
            {field.label} {field.required && "*"}
          </label>
          {isInvalid && (
            <p className="text-danger text-sm">
              {currentFormData?.errors[field.name]}
            </p>
          )}
          <input
            type="file"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            multiple={field.options?.includes("multiple")}
            accept={field.accept || "*/*"}
            onChange={(e) =>
              handleFileChange(formIndex, field.name, e.target.files, field)
            }
            onBlur={() => handleBlur(formIndex, field.name, value, field)}
          />
          {field.maxSize && (
            <p className="text-xs text-secondary">
              Maksimal filstørrelse: {field.maxSize}MB
            </p>
          )}
          {value && Array.isArray(value) && value.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium">Valgte filer:</p>
              {value?.map((file: File, i: number) => (
                <p key={i} className="text-sm text-secondary">
                  • {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (field.name === "address" && field.type === "text") {
      const addressFieldBase = {
        ...field,
        required: field.required,
        type: "text",
      };

      const isStreetInvalid =
        currentFormData?.touched.streetName &&
        !!currentFormData?.errors.streetName;
      const isPostalInvalid =
        currentFormData?.touched.postalCode &&
        !!currentFormData?.errors.postalCode;

      return (
        <label key={key} className="font-medium text-small !mt-[-20px]">
          {field.label} <span className="text-[#ff0000]">{field.required ? " *" : ""}</span>
          <div className="flex gap-3 h-16">
            <Input
              type="text"
              placeholder="Adresseplassen 13"
              labelPlacement="outside"
              required={field.required}
              value={currentFormData?.values.streetName || ""}
              errorMessage={
                isStreetInvalid ? currentFormData?.errors.streetName : undefined
              }
              isInvalid={isStreetInvalid}
              onBlur={() =>
                handleBlur(
                  formIndex,
                  "streetName",
                  currentFormData?.values.streetName,
                  {
                    ...addressFieldBase,
                    name: "streetName",
                    label: "Street Name",
                  }
                )
              }
              onChange={(e) =>
                handleChange(formIndex, "streetName", e.target.value, {
                  ...addressFieldBase,
                  name: "streetName",
                  label: "Street Name",
                })
              }
              className="w-full"
            />
            {/* <Input
              type="text"
              placeholder="Nr 1a"
              labelPlacement="outside"
              value={currentFormData?.values.additionalIdentifier || ""}
              errorMessage={
                currentFormData?.touched.additionalIdentifier && currentFormData?.errors.additionalIdentifier
              }
              onBlur={() =>
                handleBlur(
                  formIndex,
                  "additionalIdentifier",
                  currentFormData?.values.additionalIdentifier,
                  {
                    ...addressFieldBase,
                    name: "additionalIdentifier",
                    required: false,
                    label: "Additional Identifier",
                  }
                )
              }
              onChange={(e) =>
                handleChange(formIndex, "additionalIdentifier", e.target.value, {
                  ...addressFieldBase,
                  name: "additionalIdentifier",
                  required: false,
                  label: "Additional Identifier",
                })
              }
            /> */}
            <Input
              type="number"
              placeholder="0567"
              labelPlacement="outside"
              maxLength={4}
              required={field.required}
              value={currentFormData?.values.postalCode || ""}
              errorMessage={
                isPostalInvalid ? currentFormData?.errors.postalCode : undefined
              }
              isInvalid={isPostalInvalid}
              onBlur={() =>
                handleBlur(
                  formIndex,
                  "postalCode",
                  currentFormData?.values.postalCode,
                  {
                    ...addressFieldBase,
                    name: "postalCode",
                    label: "Postal Code",
                  }
                )
              }
              onChange={(e) => {
                const value = e.target.value.slice(0, 4);
                handleChange(formIndex, "postalCode", value, {
                  ...addressFieldBase,
                  name: "postalCode",
                  label: "Postal Code",
                });
              }}
            />
          </div>
        </label>
      );
    }

    switch (field.type) {
      case "text":
      case "email":
        return (
          <Input
            key={key}
            {...restOfProps}
            onChange={(e: any) =>
              handleChange(formIndex, field.name, e.target.value, field)
            }
          />
        );

      case "number":
      case "tel":
      case "phone":
        const countryCode = "+47";
        const inputLengthLimit = 8;

        let rawValue = String(value || "");
        if (rawValue.startsWith(countryCode)) {
          rawValue = rawValue
            .substring(countryCode.length)
            .trim()
            .replace(/[\s-]/g, "");
        } else {
          rawValue = rawValue.trim().replace(/[\s-]/g, "");
        }

        return (
          <Input
            key={key}
            label={fieldProps.label}
            placeholder={"Enter 8 digits (e.g., 12345678)"}
            required={fieldProps.required}
            labelPlacement={fieldProps.labelPlacement}
            value={countryCode + (rawValue.length > 0 ? " " : "") + rawValue}
            maxLength={countryCode.length + 1 + inputLengthLimit}
            isInvalid={isInvalid}
            errorMessage={fieldProps.errorMessage}
            type="text"
            inputMode="numeric"
            onKeyDown={handleNumberInput}
            onChange={(e) => {
              const newFullValue = e.target.value;
              let onlyDigits = newFullValue
                .replace(countryCode, "")
                .replace(/[\s-]/g, "");
              if (onlyDigits.length > inputLengthLimit) {
                onlyDigits = onlyDigits.substring(0, inputLengthLimit);
              }
              const finalStoredValue = onlyDigits;
              handleChange(formIndex, field.name, finalStoredValue, field);
            }}
            onBlur={() => {
              handleBlur(formIndex, field.name, rawValue, field);
            }}
          />
        );
      case "textArea":
        return (
          <Textarea
            key={key}
            {...restOfProps}
            type="text"
            className="h-auto"
            classNames={{
              inputWrapper: "min-h-auto h-auto",
              input: "min-h-64",
            }}
            onChange={(e: any) =>
              handleChange(formIndex, field.name, e.target.value, field)
            }
          />
        );
      case "radio":
        const radioProps = {
          field,
          value: value,
          error: currentFormData?.errors[field.name],
          isInvalid: isInvalid,
          onChange: (value: any) => {
            handleChange(formIndex, field.name, value, field);
            handleBlur(formIndex, field.name, value, field);
          },
        };
        return field.name === "preferranceType" ? (
          <CustomRadioGroup
            key={`${field.name}-${formIndex}`}
            {...radioProps}
          />
        ) : (
          <DefaultRadioGroup
            key={`${field.name}-${formIndex}`}
            {...radioProps}
          />
        );
      case "dropdown":
        const availableOptions =
          Array.isArray(field.options) && field.options.length > 0
            ? field.options
            : [];
        const currentValue = value;
        const effectiveValue = currentValue || availableOptions[0] || "";
        const selectedKeys = effectiveValue ? [effectiveValue] : undefined;

        return (
          <div key={field._id || index}>
            <Select
              label={fieldProps.label}
              placeholder={fieldProps.placeholder}
              required={fieldProps.required}
              labelPlacement={fieldProps.labelPlacement}
              selectedKeys={selectedKeys}
              errorMessage={fieldProps.errorMessage}
              isInvalid={fieldProps.isInvalid}
              onBlur={fieldProps.onBlur}
              popoverProps={{
                placement: "bottom",
                shouldFlip: false,

              }}
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys).join(",");
                handleChange(formIndex, field.name, selectedValue, field);
                handleBlur(formIndex, field.name, selectedValue, field);
              }}
            >
              {availableOptions?.map((opt: string, optIndex: number) => (
                <SelectItem key={opt || `opt-${optIndex}`} textValue={opt} >
                  {/* // <SelectItem key={opt || `opt-${optIndex}`} textValue={`${opt} ${optIndex}`}> */}

                  {opt}
                </SelectItem>
              ))}
            </Select>
          </div>
        );

      case "checkbox":
        const isCheckboxChecked = (fieldName: string, optionValue?: string) => {
          if (optionValue) {
            return (value || []).includes(optionValue);
          } else {
            return !!value;
          }
        };

        return (
          <div key={field._id || index} className="space-y-2">
            {Array.isArray(field.options) && field.options.length > 0 ? (
              <>
                {isInvalid && (
                  <p className="text-danger text-sm">
                    {currentFormData?.errors[field.name]}
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  {field.options?.map((opt: string, optIndex: number) => (
                    <Checkbox
                      key={`${field._id}-${optIndex}`}
                      isSelected={isCheckboxChecked(field.name, opt)}
                      onValueChange={(checked) => {
                        const currentValues = value || [];
                        let newValue;
                        if (checked) {
                          newValue = [...currentValues, opt];
                        } else {
                          newValue = currentValues.filter(
                            (v: string) => v !== opt
                          );
                        }
                        handleChange(formIndex, field.name, newValue, field);
                        handleBlur(formIndex, field.name, newValue, field);
                      }}
                    >
                      <span className="text-sm font-normal">{opt}</span>
                    </Checkbox>
                  ))}
                </div>
              </>
            ) : (
              <Checkbox
                isSelected={isCheckboxChecked(field.name)}
                onValueChange={(checked) => {
                  handleChange(formIndex, field.name, checked, field);
                  handleBlur(formIndex, field.name, checked, field);
                }}
              >
                {field.label}
                {field.required ? " *" : ""}
              </Checkbox>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Determine what to show on the left side
  const getLeftSideTitle = () => {
    if (companyFound || companyNotFound) {
      return "Tusen takk for henvendelsen.";
    }

    if (isMultiSelectMode && selectedForms.length > 0) {
      if (selectedForms.length === 1) {
        return (
          selectedForms[0]?.formData?.formName ||
          selectedForms[0]?.title ||
          "Velg Skjemaer"
        );
      }
      return "Flere skjemaer valgt";
    }

    return (
      currentFormData?.formName ||
      selectedForms[0]?.title ||
      "Velg en skjematype"
    );
  };

  const getLeftSideDescription = () => {
    if (companyFound || companyNotFound) return "";

    if (isMultiSelectMode && selectedForms.length > 1) {
      return `Du har valgt ${selectedForms.length} skjemaer å fylle ut.`;
    }

    return currentFormData?.description || "";
  };

  // Custom render for the form
  const renderFormContent = () => {
    const isInvalid =
      currentForm?.touched.selectedFormType &&
      !!currentForm?.errors.selectedFormType;

    return (
      <div className="rounded-xl shadow-md px-4 py-6 sm:p-8 bg-background max-w-xl mx-auto ">
        <h3 className="text-2xl font-semibold mb-6">
          {currentStepData?.stepTitle ||
            `Step ${currentStep + 1} of ${visibleSteps.length}`}
        </h3>

        <form className="flex flex-col gap-5 text-[16px] font-semibold min-h-[300px] justify-between">
          {/* Show form selection field if we're on step 0 */}
          {formSelect.length > 1 && currentStep === 0 && (
            <FormSelectionField
              formSelect={formSelect}
              selectedForms={selectedForms?.map((f) => f.id)}
              onSelect={handleFormSelect}
              error={currentForm?.errors.selectedFormType}
              isInvalid={isInvalid}
              touched={currentForm?.touched.selectedFormType}
              isMultiSelectMode={isMultiSelectMode}
            />
          )}

          {/* Show current step fields */}
          {currentStepData &&
            currentStepData.fields
              .filter(
                (field: FormField) =>
                  field.visible !== false && field.name !== "selectedFormType"
              )
              ?.map((field: FormField, index: number) =>
                renderField(field, index, currentFormIndex)
              )}
        </form>

        <div className="flex justify-between mt-8 gap-4">
          {(currentStep > 0 || (isMultiSelectMode && currentFormIndex > 0)) && (
            <Button
              variant="bordered"
              onPress={handlePrev}
              className="rounded-lg border-primary px-8 w-full"
              isDisabled={submitLoading}
            >
              Tidligere
            </Button>
          )}
          <Button
            color="primary"
            className="rounded-lg px-8 w-full"
            onPress={handleNext}
            isDisabled={selectedForms.length === 0 || loading || submitLoading}
          >
            {submitLoading
              ? "Sender inn..."
              : currentStep === visibleSteps.length - 1 &&
                (isMultiSelectMode
                  ? currentFormIndex === selectedForms.length - 1
                  : true)
                ? "Send inn"
                : "Neste"}
          </Button>
        </div>

        <p className="text-[14px] text-secondary/80 text-center mt-6 px-0 lg:px-16">
          {(() => {
            const [primary, secondary] = privacyText.split(/:(.+)/);

            return (
              <span>
                <span className="text-primary font-medium">{primary}:</span>{" "}
                <span className="text-secondary">{secondary}</span>
              </span>
            );
          })()}
        </p>
      </div>
    );
  };

  const steps =
    visibleSteps?.length > 0 ? visibleSteps : Array.from({ length: 4 });

  return (
    <div className="flex flex-col-reverse lg:flex-row justify-center w-full">
      {/* Left Section - Always shows title, steps, description */}
      <div className="w-full flex justify-center items-center text-center md:text-left bg-accent lg:bg-background h-full pb-18 lg:pt-18 lg:pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-xl flex flex-col max-lg:flex-col-reverse">
          {/* Progress steps - only show if we have steps */}

          {steps.length > 0 && (
            <div className="flex gap-10 justify-center md:justify-start mb-4 max-lg:hidden">
              {steps?.map((_, i: number) => (
                <div
                  key={i}
                  className={`h-6 w-[110px] flex-1 rounded-full ${i <= currentStep ? "bg-formsteps" : "bg-secondary/20"
                    }`}
                />
              ))}
            </div>
          )}

          <h1 className="lg:text-5xl text-[32px] mb-0 lg:mb-6 font-semibold text-primary mt-6">
            {/* {getLeftSideTitle()} */}
            {pageTitle}
          </h1>
          <p className="text-secondary text-sm">{pageDescription}</p>

          {/* {getLeftSideDescription() && (
            <p className="text-secondary text-sm">{getLeftSideDescription()}</p>
          )} */}

          {/* Show multi-select info */}
          {isMultiSelectMode && selectedForms.length > 1 && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <p className="text-sm text-primary font-medium">
                📋 Utvalgte skjemaer: ({currentFormIndex + 1} of{" "}
                {selectedForms.length})
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedForms?.map((form, index) => (
                  <button
                    key={form.id}
                    type="button"
                    onClick={() => {
                      setCurrentFormIndex(index);
                      setCurrentStep(0);
                    }}
                    className={`px-3 py-1 text-xs rounded-full ${index === currentFormIndex
                      ? "bg-primary text-white"
                      : "bg-white text-primary border border-primary"
                      }`}
                  >
                    {form?.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Changes based on state */}
      <div className="w-full bg-accent lg:py-16 py-10 px-4 md:px-6 lg:px-8">
        {/* Mobile progress steps - only show if we have steps */}
        {visibleSteps.length > 0 && (
          <div className="hidden gap-2 justify-center md:justify-start mb-12 max-lg:flex max-w-xl mx-auto">
            {visibleSteps?.map((_, i: number) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${i <= currentStep ? "bg-formsteps" : "bg-secondary/20"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Right side content */}
        {fetchError ? (
          <div className="rounded-xl shadow-md p-8 bg-background max-w-xl mx-auto">
            <div className="text-center">
              <FaRegCircleXmark className="text-red-500 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Error Loading Form</h3>
              <p className="text-secondary mb-4">{fetchError}</p>
              <Button
                color="primary"
                onPress={() =>
                  loadFormData(
                    currentFormIndex,
                    selectedForms[currentFormIndex].id
                  )
                }
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : companyFound || companyNotFound ? (
          <SubmissionResult
            companyFound={companyFound}
            partnerNames={partnerNames}
          />
        ) : selectedForms.length > 0 && currentFormData && currentStepData ? (
          // Show form content when we have selected forms
          renderFormContent()
        ) : (
          // Initial state: Show form selection while first form loads in background
          <div className="rounded-xl shadow-md p-8 bg-background max-w-xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6">Step 1</h3>

            <div className="flex flex-col gap-[55px] text-[16px] font-semibold min-h-[300px]">
              {formSelect.length > 1 && < FormSelectionField
                formSelect={formSelect}
                selectedForms={selectedForms?.map((f) => f.id)}
                onSelect={handleFormSelect}
                isMultiSelectMode={isMultiSelectMode}
              />}

            </div>

            <div className="flex justify-between mt-8 gap-4">
              <Button
                color="primary"
                className="rounded-lg px-8 w-full"
                onPress={handleNext}
                isDisabled={isFirstFormLoading || selectedForms.length === 0}
              >
                {/* {isFirstFormLoading ? "Loading..." : "Next"} */}
                Neste
              </Button>
            </div>

            <p className="text-[14px] text-secondary/80 text-center mt-6 px-0 lg:px-16">
              {(() => {
                const [primary, secondary] = privacyText.split(/:(.+)/);

                return (
                  <span>
                    <span className="text-primary font-medium">{primary}:</span>{" "}
                    <span className="text-secondary">{secondary}</span>
                  </span>
                );
              })()}
            </p>
          </div>
        )}
      </div>

      {isError && (
        <div
          className={`mt-4 py-3 px-3.5 border rounded-md text-sm text-center fixed top-2 right-0 w-fit m-5 max-w-[400px]   !z-[999] shadow-2xl inset-shadow-sm bg-red-50 border-red-200 text-red-800
            `}
        >
          <button
            className={`absolute -right-2 -top-2 p-1 rounded-full border cursor-pointer  bg-red-50 border-red-200`}
            onClick={hideMessageBox}
          >
            <RxCross2 />
          </button>
          <div className="flex flex-row gap-2.5  items-center ">
            <p className="hidden md:block">
              <IoWarning className="text-red-800 w-6 h-6" />
            </p>
            <p className=" text-start  text-sm">{errorMessage} </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
