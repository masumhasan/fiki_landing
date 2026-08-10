"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/ui/custom/signature-pad";
import { Upload } from "lucide-react";
import Link from "next/link";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";

export function UploadSignatureSection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-8">
      {/* File Upload Box */}
      <div className="space-y-2">
        <FieldLabel>Please Download, Fill Out, Upload Bid Form.</FieldLabel>
        <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/20 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted/40 transition-colors">
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-foreground">
            Click or drag files to this area to upload.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            You can upload up to 15 files.
          </p>
        </div>
        <FieldDescription>
          Please scan in or send an image of your completed Background Information Disclosure.
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
            <Button variant="secondary" size="xl">
              Download BID Form
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
