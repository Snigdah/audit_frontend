import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Spin } from "antd";
import { toast } from "../common/Toast";

import EmailService from "../../services/EmailService";
import { InputField } from "../common/InputField";
import CustomButton from "../common/CustomButton";

type EmailFormData = {
  senderMail: string;
  userName: string;
  appPassword: string;
  host: string;
  port: number;
  encryption: "SSL" | "TLS" | "NONE";
  receiverMail: string;
};

const EmailSettings = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmailFormData>();

  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setPageLoading(true);
      const data = await EmailService.getMailConfig();

      // Cast encryption to literal union type to satisfy TS
      reset({
        ...data,
        encryption: data.encryption as "SSL" | "TLS" | "NONE",
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.devMessage || "Failed to load email configuration"
      );
    } finally {
      setPageLoading(false);
    }
  };

  const onSubmit = async (values: EmailFormData) => {
    try {
      setIsLoading(true);
      await EmailService.configureMail(values);
      toast.success("Email configuration saved successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.devMessage || "Failed to save configuration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onTestConnection = async () => {
    try {
      setTesting(true);
      await EmailService.testMailConnection();
      toast.success("Connection successful! Check email");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.devMessage || "Connection failed"
      );
    } finally {
      setTesting(false);
    }
  };

  return (
    <Spin spinning={pageLoading} tip="Loading..." size="large">
      <div className="p-3 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col space-y-6">
          {/* Page Header */}
          <div className="text-left mb-8 border-b pb-4">
            <p className="text-sm text-gray-500 mt-1">
              Configure outgoing email settings for SMTP service.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                <InputField
                  name="senderMail"
                  label="Sender Email"
                  register={register}
                  error={errors.senderMail}
                  required
                  registerOptions={{ required: "Sender email is required" }}
                  placeholder="example@gmail.com"
                />

                <InputField
                  name="userName"
                  label="Username"
                  register={register}
                  error={errors.userName}
                  required
                  registerOptions={{ required: "Username is required" }}
                  placeholder="SMTP Username"
                />

                <InputField
                  name="appPassword"
                  label="App Password"
                  type="password"
                  register={register}
                  error={errors.appPassword}
                  required
                  registerOptions={{ required: "App password is required" }}
                  placeholder="App password"
                />

                <InputField
                  name="receiverMail"
                  label="Receiver Email"
                  register={register}
                  error={errors.receiverMail}
                  required
                  registerOptions={{ required: "Receiver email is required" }}
                  placeholder="receiver@example.com"
                />
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4">
                <InputField
                  name="host"
                  label="SMTP Host"
                  register={register}
                  error={errors.host}
                  required
                  registerOptions={{ required: "Host is required" }}
                  placeholder="smtp.gmail.com"
                />

                <InputField
                  name="port"
                  label="Port"
                  type="number"
                  register={register}
                  error={errors.port}
                  required
                  registerOptions={{ required: "Port is required" }}
                  placeholder="587"
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Encryption
                  </label>
                  <select
                    {...register("encryption", { required: "Encryption is required" })}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="SSL">SSL</option>
                    <option value="TLS">TLS</option>
                    <option value="NONE">None</option>
                  </select>
                  {errors.encryption && (
                    <p className="text-sm text-red-600">{errors.encryption.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col md:flex-row gap-4 pt-2">
              <CustomButton
                htmlType="submit"
                disabled={isLoading}
                loading={isLoading}
                loadingText="Saving..."
                className="w-full md:w-auto"
              >
                Save Settings
              </CustomButton>

              <CustomButton
                htmlType="button"
                onClick={onTestConnection}
                disabled={testing}
                loading={testing}
                loadingText="Testing..."
                className="w-full md:w-auto !bg-gray-600 hover:!bg-gray-700"
              >
                Test Connection
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </Spin>
  );
};

export default EmailSettings;
