import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "../common/InputField";
import { PasswordPolicyModel } from "../../types/PasswordPolicy";
import PasswordPolicyService from "../../services/PasswordPolicyService";
import { Button, Spin } from "antd";
import CustomButton from "../common/CustomButton";

type FormData = {
  minLength: number;
  minUppercase: number;
  minLowercase: number;
  minDigit: number;
  minSpecialChar: number;
  passwordChangeIntervalDays: number;
  passwordReuseLimit: number;
  requireAlphanumeric: boolean;
  requireSpecialChar: boolean;
  requireUniqueEmail: boolean;
  allowConcurrentLogin: boolean;
  enableTwoFactor: boolean;
  allowUsernameInPassword: boolean;
};

const PasswordPolicy = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPasswordPolicy();
  }, [reset]);

  const fetchPasswordPolicy = () => {
    setIsLoading(true);
    PasswordPolicyService.getPasswordPolicy()
      .then((response) => {
        reset(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch policy", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    const policyModel = new PasswordPolicyModel({
      ...data,
      minLength: +data.minLength,
      minUppercase: +data.minUppercase,
      minLowercase: +data.minLowercase,
      minDigit: +data.minDigit,
      minSpecialChar: +data.minSpecialChar,
      passwordChangeIntervalDays: +data.passwordChangeIntervalDays,
      passwordReuseLimit: +data.passwordReuseLimit,
    });

    PasswordPolicyService.createPasswordPolicy(policyModel)
      .then((response) => {
        setSuccessMessage(response.meta?.message || "Password policy updated");
        setErrorMessage("");
        setTimeout(() => setSuccessMessage(""), 4000);
      })
      .catch(() => {
        setErrorMessage("Failed to set password policy. Please try again.");
        setSuccessMessage("");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Spin spinning={isLoading} tip="Processing..." size="large">
      <div className="p-3 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col space-y-6">
          <div className="text-left mb-8 border-b pb-4">
            <p className="text-sm text-gray-500 mt-1">
              Set rules to enforce secure password usage across your system.
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded-md shadow-sm transition-all duration-300">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded-md shadow-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <InputField
                  name="minLength"
                  label="Minimum Password Length"
                  type="number"
                  register={register}
                  error={errors.minLength}
                  registerOptions={{
                    required: "Required",
                    min: { value: 6, message: "Minimum 6 characters" },
                  }}
                />
                <InputField
                  name="minUppercase"
                  label="Minimum Uppercase Letters"
                  type="number"
                  register={register}
                  error={errors.minUppercase}
                  registerOptions={{
                    required: "Required",
                    min: { value: 1, message: "Minimum 1 uppercase" },
                  }}
                />
                <InputField
                  name="minLowercase"
                  label="Minimum Lowercase Letters"
                  type="number"
                  register={register}
                  error={errors.minLowercase}
                  registerOptions={{
                    required: "Required",
                    min: { value: 1, message: "Minimum 1 lowercase" },
                  }}
                />
                <InputField
                  name="minDigit"
                  label="Minimum Digits"
                  type="number"
                  register={register}
                  error={errors.minDigit}
                  registerOptions={{
                    required: "Required",
                    min: { value: 1, message: "Minimum 1 digit" },
                  }}
                />
                <InputField
                  name="minSpecialChar"
                  label="Minimum Special Characters"
                  type="number"
                  register={register}
                  error={errors.minSpecialChar}
                  registerOptions={{
                    required: "Required",
                    min: { value: 1, message: "Minimum 1 special character" },
                  }}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <InputField
                  name="passwordChangeIntervalDays"
                  label="Password Change Interval (Days)"
                  type="number"
                  register={register}
                  error={errors.passwordChangeIntervalDays}
                  registerOptions={{
                    required: "Required",
                    min: { value: 1, message: "Minimum 1 day" },
                  }}
                />
                <InputField
                  name="passwordReuseLimit"
                  label="Password Reuse Limit"
                  type="number"
                  register={register}
                  error={errors.passwordReuseLimit}
                  registerOptions={{
                    required: "Required",
                    min: { value: 1, message: "Minimum 1" },
                  }}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Additional Requirements
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        id: "requireAlphanumeric",
                        label: "Require Alphanumeric",
                      },
                      {
                        id: "requireSpecialChar",
                        label: "Require Special Character",
                      },
                      {
                        id: "requireUniqueEmail",
                        label: "Require Unique Email",
                      },
                      {
                        id: "allowConcurrentLogin",
                        label: "Allow Concurrent Login",
                      },
                      {
                        id: "enableTwoFactor",
                        label: "Enable Two-Factor Authentication",
                      },
                      {
                        id: "allowUsernameInPassword",
                        label: "Allow Username in Password",
                      },
                    ].map(({ id, label }) => (
                      <div key={id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={id}
                          {...register(id as keyof FormData)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={id}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <CustomButton
                htmlType="submit"
                disabled={isLoading}
                loading={isLoading}
                loadingText="Saving..."
                className="w-full md:w-auto"
              >
                Save Policy
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </Spin>
  );
};

export default PasswordPolicy;
