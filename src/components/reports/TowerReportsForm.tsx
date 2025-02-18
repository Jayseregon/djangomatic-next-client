import React, { useState, useEffect, useCallback, memo } from "react";
import { Button } from "@heroui/react";

import siteImagesLabelOptionsData from "public/reports/rogers/siteImagesLabelOptions.json";
import { TowerReport } from "@/interfaces/reports";
import { TowerReportFormProps } from "@/interfaces/reports";
import ToastNotification from "@/components/ui/ToastNotification";
import { FormInput } from "@/components/ui/formInput";
import NotesInputs from "@/components/reports/NotesInputs";
import DocLinkButton from "@/components/docs/DocLinkButton";
import { getQuickbaseReportData } from "@/src/actions/quickbase/action";
import { useChecklistForm } from "@/hooks/useChecklistForm";
import { useNotes } from "@/hooks/useNotes";
import {
  formConfigs,
  quickbaseMapping,
  WORK_ORDER_MIN_LENGTH,
  INITIAL_FORM_STATE,
} from "@/config/towerReportConfig";
import { useImageSection } from "@/hooks/useImageSection";
import { useAntennaInventory } from "@/hooks/useAntennaInventory";
import { useToast } from "@/hooks/useToast";
import FormSectionAccordion from "@/components/reports/FormSectionAccordion";
import QuickbaseInputs from "@/components/reports/QuickbaseInputs";
import ImageUpload from "@/components/reports/imageUpload/ImageUpload";
import AntennaTransmissionInputs from "@/components/reports/AntennaTransmissionInputs";
import ChecklistForms from "@/components/reports/checklist/ChecklistForms";
import { FormActions } from "@/components/reports/FormActions";
import ErrorBoundary from "@/src/components/error/ErrorBoundary";

export const TowerReportForm = ({
  report,
  onSave,
  onLocalSave,
  onCancel,
  isNew = false,
}: TowerReportFormProps) => {
  const [formData, setFormData] =
    useState<Partial<TowerReport>>(INITIAL_FORM_STATE);

  const { checklists, initializeForm, updateForm, handleFormChange } =
    useChecklistForm();

  const {
    notes: antennaNotes,
    setNotes: setAntennaNotes,
    addNote: handleAddAntennaNote,
    updateNote: handleAntennaNoteChange,
    removeNote: handleRemoveAntennaNote,
  } = useNotes(report?.notes_antenna || []);

  const {
    notes: deficiencyNotes,
    setNotes: setDeficiencyNotes,
    addNote: handleAddDeficiencyNote,
    updateNote: handleDeficiencyNoteChange,
    removeNote: handleRemoveDeficiencyNote,
  } = useNotes(report?.notes_deficiency || []);

  const {
    inventory,
    setInventory,
    handleChange: handleAntennaInventoryChange,
    addAntenna: handleAddAntenna,
    removeAntenna: handleRemoveAntenna,
    duplicateAntenna: handleDuplicateAntenna,
  } = useAntennaInventory(report?.antenna_inventory || []);

  const { toastOpen, toastMessage, setToastOpen, setToastMessage } = useToast();

  const notes = {
    antennaNotes,
    deficiencyNotes,
  };

  const subdir = `${formData.jde_job}-${formData.jde_work_order}` || "";
  const siteImagesLabelOptions: string[] = siteImagesLabelOptionsData;

  // console.log("Report Front Image:", report?.front_image);

  const frontImageSection = useImageSection(report?.front_image);

  // console.log("Front Image Section:", frontImageSection.images);

  const siteImageSection = useImageSection(report?.site_images);
  const deficiencyImageSection = useImageSection(report?.deficiency_images);

  const isWorkOrderValid =
    (formData.jde_work_order ?? "").length >= WORK_ORDER_MIN_LENGTH;

  useEffect(() => {
    if (report) {
      setFormData({
        jde_work_order: report.jde_work_order || "",
        jde_job: report.jde_job || "",
        site_name: report.site_name || "",
        site_code: report.site_code || "",
        site_region: report.site_region || "",
        tower_id: report.tower_id || "",
        tower_name: report.tower_name || "",
        tower_site_name: report.tower_site_name || "",
        job_revision: report.job_revision || "",
        job_description: report.job_description || "",
        design_standard: report.design_standard || "",
        client_company: report.client_company || "",
        client_name: report.client_name || "",
        redline_pages: report.redline_pages || 0,
        assigned_peng: report.assigned_peng || "",
      });
      setAntennaNotes(report.notes_antenna || []);
      setDeficiencyNotes(report.notes_deficiency || []);
      setInventory(report.antenna_inventory || []);

      // Initialize checklist forms
      formConfigs.forEach(({ key, formKey, list }) => {
        initializeForm(report[formKey], list, key);
      });
    }

    const notification = localStorage.getItem("reportNotification");

    if (notification) {
      setTimeout(() => {
        setToastMessage(JSON.parse(notification));
        setToastOpen(true);
      }, 500);
      localStorage.removeItem("reportNotification");
    }
  }, [report, initializeForm, setAntennaNotes, setDeficiencyNotes]);

  const getReportData = useCallback(
    (): Partial<TowerReport> => ({
      ...formData,
      site_images: siteImageSection.images,
      front_image: frontImageSection.images,
      deficiency_images: deficiencyImageSection.images,
      antenna_inventory: inventory,
      checklistForm4: checklists.form4,
      checklistForm5: checklists.form5,
      checklistForm6: checklists.form6,
      checklistForm7: checklists.form7,
      checklistForm8: checklists.form8,
      checklistForm9: checklists.form9,
      checklistForm10: checklists.form10,
      checklistForm11: checklists.form11,
      notes_antenna: notes.antennaNotes,
      notes_deficiency: notes.deficiencyNotes,
    }),
    [
      formData,
      siteImageSection.images,
      frontImageSection.images,
      deficiencyImageSection.images,
      inventory,
      checklists,
      notes,
    ],
  );

  const getAllNewlyUploadedImages = useCallback(
    () => [
      ...frontImageSection.newlyUploadedImages,
      ...siteImageSection.newlyUploadedImages,
      ...deficiencyImageSection.newlyUploadedImages,
    ],
    [
      frontImageSection.newlyUploadedImages,
      siteImageSection.newlyUploadedImages,
      deficiencyImageSection.newlyUploadedImages,
    ],
  );

  const resetNewlyUploadedImages = useCallback(() => {
    frontImageSection.resetNewlyUploaded();
    siteImageSection.resetNewlyUploaded();
    deficiencyImageSection.resetNewlyUploaded();
  }, [frontImageSection, siteImageSection, deficiencyImageSection]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSave(getReportData());
    },
    [getReportData, onSave],
  );

  const handleSaveAndContinue = async () => {
    const result = await onLocalSave(getReportData());

    if (result.success) {
      resetNewlyUploadedImages();
      if (!result.isNewReport) {
        setToastMessage(result.response);
        setToastOpen(true);
      }
    } else {
      setToastMessage(result.response);
      setToastOpen(true);
    }
  };

  const handleCancelClick = () => {
    onCancel(getAllNewlyUploadedImages(), subdir);
  };

  const handleSearchQB = async () => {
    const data = await getQuickbaseReportData(formData.jde_work_order);

    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...Object.entries(quickbaseMapping).reduce(
          (acc, [key, qbField]) => ({
            ...acc,
            [key]: String(data[qbField]),
          }),
          {},
        ),
      }));
    }
  };

  const handleGeneratePDF = () => {
    if (report?.id) {
      // window.open(`/api/pdf/${report.id}`, "_blank");
      window.open(`/pdf/rogers/${report.id}`, "_blank");
    }
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      let parsedValue;

      if (name === "redline_pages" && !isNaN(parseInt(value))) {
        parsedValue = parseInt(value);
      } else {
        parsedValue = value;
      }
      setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    },
    [],
  );

  return (
    <>
      <DocLinkButton projectType="admin_docs" slug="pci-reports-rogers" />
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <form
          aria-label="Tower Report Form"
          className="space-y-4 w-full px-20 pt-5 z-30"
          role="form"
          onSubmit={handleSubmit}
        >
          {/* Quickbase Query */}
          <div className="grid grid-cols-2 items-center gap-8">
            <FormInput
              label="Work Order"
              name="jde_work_order"
              placeholder="XXXXXX"
              value={formData.jde_work_order}
              onChange={handleChange}
            />
            <div className="h-full w-full content-end">
              <Button
                className="bg-primary text-white w-full h-10"
                isDisabled={!isWorkOrderValid}
                radius="full"
                variant="solid"
                onPress={handleSearchQB}
              >
                Search QB
              </Button>
            </div>
          </div>

          {isWorkOrderValid && (
            <>
              {/* Front Images */}
              <ImageUpload
                images={frontImageSection.images}
                isFrontcover={true}
                labelPlaceholder="Front Image"
                newImageButtonName="Add Cover Image"
                subdir={subdir}
                onImagesChange={frontImageSection.handleImagesChange}
                onNewImageUpload={frontImageSection.handleNewImageUpload}
              />

              {/* Divider */}
              <FormSectionAccordion
                defaultOpen
                menuKey="qb-data"
                title="Quickbase Project Data"
              >
                {/* Quickbase Data */}
                <QuickbaseInputs
                  formData={formData}
                  handleChange={handleChange}
                />
              </FormSectionAccordion>

              <FormSectionAccordion
                menuKey="antenna"
                title="Antenna & Transmission Line Inventory"
              >
                {/* Antenna & Transmission Line Inventory */}
                <div className="space-y-10">
                  <AntennaTransmissionInputs
                    antennaInventory={inventory}
                    onAddAntenna={handleAddAntenna}
                    onAntennaChange={handleAntennaInventoryChange}
                    onDuplicateAntenna={handleDuplicateAntenna}
                    onRemoveAntenna={handleRemoveAntenna}
                  />

                  {/* Antenna Notes Section */}
                  <NotesInputs
                    notes={notes.antennaNotes}
                    onAddNote={handleAddAntennaNote}
                    onNoteChange={handleAntennaNoteChange}
                    onRemoveNote={handleRemoveAntennaNote}
                  />
                </div>
              </FormSectionAccordion>

              <FormSectionAccordion
                menuKey="deficiencies"
                title="Deficiency Images"
              >
                {/* Deficiency Images */}
                <div className="space-y-10">
                  <ImageUpload
                    images={deficiencyImageSection.images}
                    isDeficiency={true}
                    labelOptions={[]}
                    labelPlaceholder="Description"
                    newImageButtonName="Add Deficiency"
                    subdir={subdir}
                    onImagesChange={deficiencyImageSection.handleImagesChange}
                    onNewImageUpload={
                      deficiencyImageSection.handleNewImageUpload
                    }
                  />

                  {/* Deficiency Notes Section */}
                  <NotesInputs
                    notes={notes.deficiencyNotes}
                    onAddNote={handleAddDeficiencyNote}
                    onNoteChange={handleDeficiencyNoteChange}
                    onRemoveNote={handleRemoveDeficiencyNote}
                  />
                </div>
              </FormSectionAccordion>

              <FormSectionAccordion menuKey="site" title="Site Images">
                {/* Site Images */}

                <ImageUpload
                  images={siteImageSection.images}
                  labelOptions={siteImagesLabelOptions}
                  labelPlaceholder="Select/Edit an option"
                  newImageButtonName="Add Site Image"
                  subdir={subdir}
                  onImagesChange={siteImageSection.handleImagesChange}
                  onNewImageUpload={siteImageSection.handleNewImageUpload}
                />
              </FormSectionAccordion>

              {/* Checklist Forms */}
              {isWorkOrderValid && (
                <ChecklistForms
                  checklists={checklists}
                  formConfigs={formConfigs}
                  onFormChange={handleFormChange}
                  onFormUpdate={updateForm}
                />
              )}
            </>
          )}

          <FormActions
            isNew={isNew}
            onCancel={handleCancelClick}
            onGeneratePDF={handleGeneratePDF}
            onSaveAndContinue={handleSaveAndContinue}
          />

          <ToastNotification
            open={toastOpen}
            response={toastMessage}
            setOpen={setToastOpen}
          />
        </form>
      </ErrorBoundary>
    </>
  );
};

// Optimize exports for tree-shaking
export default memo(TowerReportForm);
