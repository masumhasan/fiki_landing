"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/ui/custom/signature-pad";
import { Upload, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { useRef, useState, useEffect } from "react";

export function UploadSignatureSection() {
  const { control, setValue, watch } = useFormContext();
  const bidFormValue = watch("bidForm");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  // Determine initial file name if bidFormValue is already present (e.g. going back/forth steps)
  useEffect(() => {
    if (bidFormValue && !fileName) {
      setFileName("Wisconsin_BID_Form.pdf");
    }
  }, [bidFormValue, fileName]);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 15 * 1024 * 1024) {
        alert("File size exceeds 15MB limit.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setValue("bidForm", base64, { shouldValidate: true });
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* File Upload Box */}
      <div className="space-y-2">
        <FieldLabel>Please Download, Fill Out, Upload BID Form.</FieldLabel>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,image/*,.doc,.docx"
          className="hidden"
        />

        {bidFormValue ? (
          <div className="border border-emerald-200 bg-emerald-50/10 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <FileText className="size-5.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                    {fileName}
                  </p>
                  <CheckCircle className="size-4 text-emerald-500 shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Ready for submission</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/20 hover:bg-destructive/5 font-semibold shrink-0 cursor-pointer rounded-full"
              onClick={() => {
                setValue("bidForm", "", { shouldValidate: true });
                setFileName("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div
            onClick={handleBoxClick}
            className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/20 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted/40 transition-colors"
          >
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">
              Click to browse or drag your file here.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports PDF, PNG, JPG, DOC, or DOCX (Max 15MB)
            </p>
          </div>
        )}

        <FieldDescription>
          Please scan or take a photo of your completed Wisconsin Background Information Disclosure.
        </FieldDescription>
      </div>

      {/* Signature */}
      <Controller
        control={control}
        name="signature"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Signature Here <span className="text-destructive">*</span>
            </FieldLabel>
            <SignaturePad
              value={field.value}
              onChange={field.onChange}
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <div>
          <Button type="submit" variant="action" size="xl">
            Apply For The Job
          </Button>
        </div>

        <div>
          <Link href="/bid" download>
            <Button variant="secondary" size="xl" type="button">
              Download BID Form
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
