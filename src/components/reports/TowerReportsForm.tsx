import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/react";
import { CircleOff, FileText, Save, SaveAll } from "lucide-react";

import listForm4 from "public/reports/rogers/listForm4.json";
import listForm5 from "public/reports/rogers/listForm5.json";
import listForm6 from "public/reports/rogers/listForm6.json";
import listForm7 from "public/reports/rogers/listForm7.json";
import listForm8 from "public/reports/rogers/listForm8.json";
import listForm9 from "public/reports/rogers/listForm9.json";
import listForm10 from "public/reports/rogers/listForm10.json";
import listForm11 from "public/reports/rogers/listForm11.json";
import siteImagesLabelOptionsData from "public/reports/rogers/siteImagesLabelOptions.json";
import {
  TowerReport,
  TowerReportImage,
  AntennaTransmissionLine,
} from "@/interfaces/reports";
import { TowerReportFormProps } from "@/interfaces/reports";
import ToastNotification, {
  ToastResponse,
} from "@/components/ui/ToastNotification";
import { FormInput } from "@/components/ui/formInput";
import NotesInputs from "@/components/reports/NotesInputs";
import DocLinkButton from "@/components/docs/DocLinkButton";
import { getQuickbaseReportData } from "@/src/actions/quickbase/action";
import { useChecklistForm } from "@/hooks/useChecklistForm";
import { useNotes } from "@/hooks/useNotes";

import FormSectionAccordion from "./FormSectionAccordion";
import QuickbaseInputs from "./QuickbaseInputs";
import ImageUpload from "./imageUpload/ImageUpload";
import AntennaTransmissionInputs from "./AntennaTransmissionInputs";
import { ChecklistForms } from "./checklist/ChecklistForms";

// Add this type definition
type ChecklistFormKey =
  | "checklistForm4"
  | "checklistForm5"
  | "checklistForm6"
  | "checklistForm7"
  | "checklistForm8"
  | "checklistForm9"
  | "checklistForm10"
  | "checklistForm11";

export const TowerReportForm = ({
  report,
  onSave,
  onLocalSave,
  onCancel,
  isNew = false,
}: TowerReportFormProps) => {
  const [formData, setFormData] = useState<Partial<TowerReport>>({
    jde_work_order: "",
    jde_job: "",
    site_name: "",
    site_code: "",
    site_region: "",
    tower_id: "",
    tower_name: "",
    tower_site_name: "",
    job_revision: "",
    job_description: "",
    design_standard: "",
    client_company: "",
    client_name: "",
    redline_pages: 0,
    assigned_peng: "",
  });

  const [images, setImages] = useState({
    siteImages: [] as TowerReportImage[],
    frontImages: [] as TowerReportImage[],
    deficiencyImages: [] as TowerReportImage[],
    newlyUploadedImages: [] as TowerReportImage[],
  });

  const [inventory, setInventory] = useState<AntennaTransmissionLine[]>([]);

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

  // Replace the notes state with individual states
  const notes = {
    antennaNotes,
    deficiencyNotes,
  };

  // Define form configurations
  const formConfigs = [
    {
      key: "form4",
      formKey: "checklistForm4" as ChecklistFormKey,
      title: "FORM 4: Civil - Antenna Structure and Site Works",
      list: listForm4,
    },
    {
      key: "form5",
      formKey: "checklistForm5" as ChecklistFormKey,
      title:
        "FORM 5: Civil - Electrical/Mechanical Alarm & Fire Protection Systems",
      list: listForm5,
    },
    {
      key: "form6",
      formKey: "checklistForm6" as ChecklistFormKey,
      title: "FORM 6: Civil - AC Power and Grounding",
      list: listForm6,
    },
    {
      key: "form7",
      formKey: "checklistForm7" as ChecklistFormKey,
      title: "FORM 7: Civil - Cable Tray and Overhead Support",
      list: listForm7,
    },
    {
      key: "form8",
      formKey: "checklistForm8" as ChecklistFormKey,
      title: "FORM 8: Technical Install & Commission - Cellular Base Station",
      list: listForm8,
    },
    {
      key: "form9",
      formKey: "checklistForm9" as ChecklistFormKey,
      title: "FORM 9: Technical Install & Commission - Microwave Radio",
      list: listForm9,
    },
    {
      key: "form10",
      formKey: "checklistForm10" as ChecklistFormKey,
      title: "FORM 10: Technical Install & Commission - AC/DC Power",
      list: listForm10,
    },
    {
      key: "form11",
      formKey: "checklistForm11" as ChecklistFormKey,
      title:
        "FORM 11: Technical Install & Commission - Miscellaneous Equipment",
      list: listForm11,
    },
  ];

  const subdir = `${formData.jde_job}-${formData.jde_work_order}` || "";
  const siteImagesLabelOptions: string[] = siteImagesLabelOptionsData;
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<ToastResponse>({
    message: "",
    id: "",
    updatedAt: new Date(),
  });

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
      setImages({
        siteImages: report.site_images || [],
        frontImages: report.front_image || [],
        deficiencyImages: report.deficiency_images || [],
        newlyUploadedImages: [],
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

  const getReportData = useCallback((): Partial<TowerReport> => {
    return {
      ...formData,
      site_images: images.siteImages,
      front_image: images.frontImages,
      deficiency_images: images.deficiencyImages,
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
    };
  }, [formData, images, inventory, checklists, notes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(getReportData());
  };

  const handleSaveAndContinue = async () => {
    const result = await onLocalSave(getReportData());

    if (result.success) {
      // Reset the state of newlyUploadedImages after a successful local save
      setImages((prev) => ({ ...prev, newlyUploadedImages: [] }));
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
    onCancel(images.newlyUploadedImages, subdir);
  };

  const handleNewImageUpload = (image: TowerReportImage) => {
    setImages((prev) => ({
      ...prev,
      newlyUploadedImages: [...prev.newlyUploadedImages, image],
    }));
  };

  const handleSearchQB = async () => {
    const data = await getQuickbaseReportData(formData.jde_work_order);

    if (data) {
      setFormData((prev) => ({
        ...prev,
        jde_job: String(data["1141"]),
        site_name: String(data["1114"]),
        site_code: String(data["1113"]),
        site_region: String(data["1195"]),
        tower_id: String(data["1115"]),
        tower_name: String(data["1149"]),
        tower_site_name: String(data["1116"]),
        job_revision: String(data["1132"]),
        job_description: String(data["1134"]),
        design_standard: String(data["1135"]),
        client_company: String(data["1137"]),
        client_name: String(data["1117"]),
        assigned_peng: String(data["1048"]),
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

  const handleAntennaInventoryChange = useCallback(
    (index: number, field: string, value: string) => {
      setInventory((prev) => {
        const updatedInventory = [...prev];

        updatedInventory[index] = {
          ...updatedInventory[index],
          [field]: value,
        };

        return updatedInventory;
      });
    },
    [],
  );

  const handleAddAntenna = useCallback(() => {
    setInventory((prev) => [
      ...prev,
      {
        id: "",
        elevation: "",
        quantity: "",
        equipment: "",
        azimuth: "",
        tx_line: "",
        odu: "",
        carrier: "",
        projectId: [],
      },
    ]);
  }, []);

  const handleRemoveAntenna = useCallback((index: number) => {
    setInventory((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDuplicateAntenna = useCallback((index: number) => {
    setInventory((prev) => {
      const antennaToDuplicate = prev[index];
      const duplicatedAntenna = { ...antennaToDuplicate };
      const updatedInventory = [
        ...prev.slice(0, index + 1),
        duplicatedAntenna,
        ...prev.slice(index + 1),
      ];

      return updatedInventory;
    });
  }, []);

  return (
    <>
      <DocLinkButton projectType="admin_docs" slug="pci-reports-rogers" />
      <form
        className="space-y-4 w-full px-20 pt-5 z-30"
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
              isDisabled={
                !formData.jde_work_order || formData.jde_work_order?.length < 6
              }
              radius="full"
              variant="solid"
              onPress={handleSearchQB}
            >
              Search QB
            </Button>
          </div>
        </div>

        {/* Front Images */}
        {formData.jde_work_order && formData.jde_work_order?.length > 5 && (
          <ImageUpload
            images={images.frontImages}
            isFrontcover={true}
            labelPlaceholder="Front Image"
            newImageButtonName="Add Cover Image"
            subdir={subdir}
            onImagesChange={(newImages) =>
              setImages((prev) => ({ ...prev, frontImages: newImages }))
            }
            onNewImageUpload={handleNewImageUpload}
          />
        )}

        {/* Divider */}
        <FormSectionAccordion
          defaultOpen
          menuKey="qb-data"
          title="Quickbase Project Data"
        >
          {/* Quickbase Data */}
          <QuickbaseInputs formData={formData} handleChange={handleChange} />
        </FormSectionAccordion>

        {/* Divider */}
        <FormSectionAccordion
          menuKey="antenna"
          title="Antenna & Transmission Line Inventory"
        >
          {/* Antenna & Transmission Line Inventory */}
          <div className="space-y-10">
            {formData.jde_work_order && formData.jde_work_order?.length > 5 && (
              <AntennaTransmissionInputs
                antennaInventory={inventory}
                onAddAntenna={handleAddAntenna}
                onAntennaChange={handleAntennaInventoryChange}
                onDuplicateAntenna={handleDuplicateAntenna}
                onRemoveAntenna={handleRemoveAntenna}
              />
            )}
            {/* Antenna Notes Section */}
            <NotesInputs
              notes={notes.antennaNotes}
              onAddNote={handleAddAntennaNote}
              onNoteChange={handleAntennaNoteChange}
              onRemoveNote={handleRemoveAntennaNote}
            />
          </div>
        </FormSectionAccordion>

        {/* Divider */}
        <FormSectionAccordion menuKey="deficiencies" title="Deficiency Images">
          {/* Deficiency Images */}
          <div className="space-y-10">
            {formData.jde_work_order && formData.jde_work_order?.length > 5 && (
              <ImageUpload
                images={images.deficiencyImages}
                isDeficiency={true}
                labelOptions={[]}
                labelPlaceholder="Description"
                newImageButtonName="Add Deficiency"
                subdir={subdir}
                onImagesChange={(newImages) =>
                  setImages((prev) => ({
                    ...prev,
                    deficiencyImages: newImages,
                  }))
                }
                onNewImageUpload={handleNewImageUpload}
              />
            )}
            {/* Deficiency Notes Section */}
            <NotesInputs
              notes={notes.deficiencyNotes}
              onAddNote={handleAddDeficiencyNote}
              onNoteChange={handleDeficiencyNoteChange}
              onRemoveNote={handleRemoveDeficiencyNote}
            />
          </div>
        </FormSectionAccordion>

        {/* Divider */}
        <FormSectionAccordion menuKey="site" title="Site Images">
          {/* Site Images */}
          {formData.jde_work_order && formData.jde_work_order?.length > 5 && (
            <ImageUpload
              images={images.siteImages}
              labelOptions={siteImagesLabelOptions}
              labelPlaceholder="Select/Edit an option"
              newImageButtonName="Add Site Image"
              subdir={subdir}
              onImagesChange={(newImages) =>
                setImages((prev) => ({ ...prev, siteImages: newImages }))
              }
              onNewImageUpload={handleNewImageUpload}
            />
          )}
        </FormSectionAccordion>

        {/* Checklist Forms */}
        {formData.jde_work_order && formData.jde_work_order?.length > 5 && (
          <ChecklistForms
            checklists={checklists}
            formConfigs={formConfigs}
            onFormChange={handleFormChange}
            onFormUpdate={updateForm}
          />
        )}

        <div className="space-x-4 mt-4 mx-auto">
          <Button isIconOnly color="success" type="submit">
            <SaveAll />
          </Button>
          <Button
            isIconOnly
            color="success"
            type="button"
            variant="bordered"
            onPress={handleSaveAndContinue}
          >
            <Save />
          </Button>
          {!isNew && (
            <Button
              isIconOnly
              color="primary"
              type="button"
              variant="bordered"
              onPress={handleGeneratePDF}
            >
              <FileText />
            </Button>
          )}
          <Button
            isIconOnly
            color="danger"
            type="button"
            variant="bordered"
            onPress={handleCancelClick}
          >
            <CircleOff />
          </Button>
        </div>
        <ToastNotification
          open={toastOpen}
          response={toastMessage}
          setOpen={setToastOpen}
        />
      </form>
    </>
  );
};
