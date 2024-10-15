import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { CircleOff, Download, FileOutput, Save } from "lucide-react";

import DynamicForm, {
  ListItem,
} from "@/components/reports/checklist/DynamicForm";
import {
  TowerReport,
  TowerReportImage,
  AntennaTransmissionLine,
  ChecklistRow,
} from "@/types/reports";
import { TowerReportFormProps } from "@/interfaces/reports";
import ToastNotification, {
  ToastResponse,
} from "@/components/ui/ToastNotification";
import { FormInput } from "@/components/ui/formInput";
import { fetchListForm, fetchGenericJson } from "@/src/lib/jsonUtils";

import FormSectionAccordion from "./FormSectionAccordion";
import QuickbaseInputs from "./QuickbaseInputs";
import ImageUpload from "./imageUpload/ImageUpload";
import AntennaTransmissionInputs from "./AntennaTransmissionInputs";

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
  const [siteImages, setSiteImages] = useState<TowerReportImage[]>([]);
  const [frontImages, setFrontImages] = useState<TowerReportImage[]>([]);
  const [deficiencyImages, setDeficiencyImages] = useState<TowerReportImage[]>(
    [],
  );
  const [newlyUploadedImages, setNewlyUploadedImages] = useState<
    TowerReportImage[]
  >([]);
  const [antennaInventory, setAntennaInventory] = useState<
    AntennaTransmissionLine[]
  >([]);
  const [checklistForm4, setChecklistForm4] = useState<ChecklistRow[]>([]);
  const [checklistForm5, setChecklistForm5] = useState<ChecklistRow[]>([]);
  const [checklistForm6, setChecklistForm6] = useState<ChecklistRow[]>([]);
  const [checklistForm7, setChecklistForm7] = useState<ChecklistRow[]>([]);
  const [checklistForm8, setChecklistForm8] = useState<ChecklistRow[]>([]);
  const [checklistForm9, setChecklistForm9] = useState<ChecklistRow[]>([]);
  const [checklistForm10, setChecklistForm10] = useState<ChecklistRow[]>([]);
  const [checklistForm11, setChecklistForm11] = useState<ChecklistRow[]>([]);
  const [listForm4, setListForm4] = useState<ListItem[]>([]);
  const [listForm5, setListForm5] = useState<ListItem[]>([]);
  const [listForm6, setListForm6] = useState<ListItem[]>([]);
  const [listForm7, setListForm7] = useState<ListItem[]>([]);
  const [listForm8, setListForm8] = useState<ListItem[]>([]);
  const [listForm9, setListForm9] = useState<ListItem[]>([]);
  const [listForm10, setListForm10] = useState<ListItem[]>([]);
  const [listForm11, setListForm11] = useState<ListItem[]>([]);
  const subdir = `${formData.jde_job}-${formData.jde_work_order}` || "";

  const [siteImagesLabelOptions, setSiteImagesLabelOptions] = useState<
    string[]
  >([]);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<ToastResponse>({
    message: "",
    id: "",
    updatedAt: new Date(),
  });

  const initializeChecklistForm = (
    reportForm: ChecklistRow[] | undefined,
    listForm: ListItem[],
    setChecklistForm: React.Dispatch<React.SetStateAction<ChecklistRow[]>>,
  ) => {
    if (reportForm && reportForm.length > 0) {
      setChecklistForm(reportForm);
    } else {
      const initialForm = listForm.map((listItem) => ({
        id: "",
        code: listItem.code,
        isChecked: undefined,
        comments: "",
      }));

      setChecklistForm(initialForm);
    }
  };

  useEffect(() => {
    const fetchSiteImagesLabelOptions = async () => {
      await fetchGenericJson(
        "public/reports/rogers/siteImagesLabelOptions.json",
        setSiteImagesLabelOptions,
      );
    };

    fetchSiteImagesLabelOptions();
  }, []);

  useEffect(() => {
    const fetchAndInitializeForms = async () => {
      const listFormIds = ["4", "5", "6", "7", "8", "9", "10", "11"];
      const setListFormFunctions = [
        setListForm4,
        setListForm5,
        setListForm6,
        setListForm7,
        setListForm8,
        setListForm9,
        setListForm10,
        setListForm11,
      ];
      const setChecklistFormFunctions = [
        setChecklistForm4,
        setChecklistForm5,
        setChecklistForm6,
        setChecklistForm7,
        setChecklistForm8,
        setChecklistForm9,
        setChecklistForm10,
        setChecklistForm11,
      ];
      const reportForms = [
        report?.checklistForm4,
        report?.checklistForm5,
        report?.checklistForm6,
        report?.checklistForm7,
        report?.checklistForm8,
        report?.checklistForm9,
        report?.checklistForm10,
        report?.checklistForm11,
      ];

      for (let i = 0; i < listFormIds.length; i++) {
        const listFormId = listFormIds[i];
        const setListForm = setListFormFunctions[i];
        const setChecklistForm = setChecklistFormFunctions[i];
        const reportForm = reportForms[i];

        const listForm = await fetchListForm(listFormId, setListForm);

        initializeChecklistForm(reportForm, listForm, setChecklistForm);
      }
    };

    if (report) {
      fetchAndInitializeForms();
    }
  }, [report]);

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
      setSiteImages(report.site_images || []);
      setFrontImages(report.front_image || []);
      setDeficiencyImages(report.deficiency_images || []);
      setAntennaInventory(report.antenna_inventory || []);
    }

    const notification = localStorage.getItem("reportNotification");

    if (notification) {
      setTimeout(() => {
        setToastMessage(JSON.parse(notification));
        setToastOpen(true);
      }, 500);
      localStorage.removeItem("reportNotification");
    }
  }, [report]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      site_images: siteImages,
      front_image: frontImages,
      deficiency_images: deficiencyImages,
      antenna_inventory: antennaInventory,
      checklistForm4: checklistForm4,
      checklistForm5: checklistForm5,
      checklistForm6: checklistForm6,
      checklistForm7: checklistForm7,
      checklistForm8: checklistForm8,
      checklistForm9: checklistForm9,
      checklistForm10: checklistForm10,
      checklistForm11: checklistForm11,
    });
  };

  const handleSaveAndContinue = async () => {
    const result = await onLocalSave({
      ...formData,
      site_images: siteImages,
      front_image: frontImages,
      deficiency_images: deficiencyImages,
      antenna_inventory: antennaInventory,
      checklistForm4: checklistForm4,
      checklistForm5: checklistForm5,
      checklistForm6: checklistForm6,
      checklistForm7: checklistForm7,
      checklistForm8: checklistForm8,
      checklistForm9: checklistForm9,
      checklistForm10: checklistForm10,
      checklistForm11: checklistForm11,
    });

    if (result.success) {
      // Reset the state of newlyUploadedImages after a successful local save
      setNewlyUploadedImages([]);
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
    onCancel(newlyUploadedImages, subdir);
  };

  const handleNewImageUpload = (image: TowerReportImage) => {
    setNewlyUploadedImages((prev) => [...prev, image]);
  };

  const handleSearchQB = async () => {
    const response = await fetch(
      `/api/quickbase?id=${formData.jde_work_order}`,
    );
    const data = await response.json();

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
      window.open(`/api/pdf/${report.id}`, "_blank");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    let parsedValue;

    if (name === "redline_pages" && !isNaN(parseInt(value))) {
      parsedValue = parseInt(value);
    } else {
      parsedValue = value;
    }
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleAntennaInventoryChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    setAntennaInventory((prev) => {
      const updatedInventory = [...prev];

      updatedInventory[index] = { ...updatedInventory[index], [field]: value };

      return updatedInventory;
    });
  };

  const handleAddAntenna = () => {
    setAntennaInventory((prev) => [
      ...prev,
      {
        id: "",
        elevation: 0,
        quantity: 0,
        equipment: "",
        azimuth: 0,
        tx_line: "",
        odu: "",
        carrier: "",
        projectId: [],
      },
    ]);
  };

  const handleRemoveAntenna = (index: number) => {
    setAntennaInventory((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChecklistFormChange = (
    setChecklistForm: React.Dispatch<React.SetStateAction<any[]>>,
    index: number,
    field: string,
    value: string | boolean | undefined,
  ) => {
    setChecklistForm((prev) => {
      const updatedChecklist = [...prev];

      updatedChecklist[index] = { ...updatedChecklist[index], [field]: value };

      return updatedChecklist;
    });
  };

  return (
    <form className="space-y-4 w-full px-20 pt-5" onSubmit={handleSubmit}>
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
            className="bg-primary text-white w-full w-full h-10"
            isDisabled={
              !formData.jde_work_order || formData.jde_work_order?.length < 6
            }
            radius="full"
            variant="solid"
            onClick={handleSearchQB}
          >
            Search QB
          </Button>
        </div>
      </div>

      {/* Front Images */}
      {formData.jde_work_order && formData.jde_work_order?.length > 5 && (
        <ImageUpload
          images={frontImages}
          isFrontcover={true}
          labelPlaceholder="Front Image"
          newImageButtonName="Add Cover Image"
          subdir={subdir}
          onImagesChange={setFrontImages}
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
        {formData.jde_work_order && formData.jde_work_order?.length > 5 && (
          <AntennaTransmissionInputs
            antennaInventory={antennaInventory}
            onAddAntenna={handleAddAntenna}
            onAntennaChange={handleAntennaInventoryChange}
            onRemoveAntenna={handleRemoveAntenna}
          />
        )}
      </FormSectionAccordion>

      {/* Divider */}
      <FormSectionAccordion menuKey="deficiencies" title="Deficiency Images">
        {/* Deficiency Images */}
        {formData.jde_work_order && formData.jde_work_order?.length > 5 && (
          <ImageUpload
            images={deficiencyImages}
            isDeficiency={true}
            labelOptions={[]}
            labelPlaceholder="Description"
            newImageButtonName="Add Deficiency"
            subdir={subdir}
            onImagesChange={setDeficiencyImages}
            onNewImageUpload={handleNewImageUpload}
          />
        )}
      </FormSectionAccordion>

      {/* Divider */}
      <FormSectionAccordion menuKey="site" title="Site Images">
        {/* Site Images */}
        {formData.jde_work_order && formData.jde_work_order?.length > 5 && (
          <ImageUpload
            images={siteImages}
            labelOptions={siteImagesLabelOptions}
            labelPlaceholder="Select/Edit an option"
            newImageButtonName="Add Site Image"
            subdir={subdir}
            onImagesChange={setSiteImages}
            onNewImageUpload={handleNewImageUpload}
          />
        )}
      </FormSectionAccordion>

      {/* Form 4 */}
      <FormSectionAccordion
        menuKey="form4"
        title="FORM 4: Civil - Antenna Structure and Site Works"
      >
        <DynamicForm
          checkListForm={checklistForm4}
          list={listForm4}
          setChecklistForm={setChecklistForm4}
          onFormChange={handleChecklistFormChange}
        />
      </FormSectionAccordion>

      {/* Form 5 */}
      <FormSectionAccordion
        menuKey="form5"
        title="FORM 5: Civil - Electrical/Mechanical Alarm & Fire Protection Systems"
      >
        <DynamicForm
          checkListForm={checklistForm5}
          list={listForm5}
          setChecklistForm={setChecklistForm5}
          onFormChange={handleChecklistFormChange}
        />
      </FormSectionAccordion>

      {/* Form 6 */}
      <FormSectionAccordion
        menuKey="form6"
        title="FORM 6: Civil - AC Power and Grounding"
      >
        <DynamicForm
          checkListForm={checklistForm6}
          list={listForm6}
          setChecklistForm={setChecklistForm6}
          onFormChange={handleChecklistFormChange}
        />
      </FormSectionAccordion>

      {/* Form 7 */}
      <FormSectionAccordion
        menuKey="form7"
        title="FORM 7: Civil - Cable Tray and Overhead Support"
      >
        <DynamicForm
          checkListForm={checklistForm7}
          list={listForm7}
          setChecklistForm={setChecklistForm7}
          onFormChange={handleChecklistFormChange}
        />
      </FormSectionAccordion>

      {/* Form 8 */}
      <FormSectionAccordion
        menuKey="form8"
        title="FORM 8: Technical Install & Commission - Cellular Base Station"
      >
        <DynamicForm
          checkListForm={checklistForm8}
          list={listForm8}
          setChecklistForm={setChecklistForm8}
          onFormChange={handleChecklistFormChange}
        />
      </FormSectionAccordion>

      {/* Form 9 */}
      <FormSectionAccordion
        menuKey="form9"
        title="FORM 9: Technical Install & Commission - Microwave Radio"
      >
        <DynamicForm
          checkListForm={checklistForm9}
          list={listForm9}
          setChecklistForm={setChecklistForm9}
          onFormChange={handleChecklistFormChange}
        />
      </FormSectionAccordion>

      {/* Form 10 */}
      <FormSectionAccordion
        menuKey="form10"
        title="FORM 10: Technical Install & Commission - AC/DC Power"
      >
        <DynamicForm
          checkListForm={checklistForm10}
          list={listForm10}
          setChecklistForm={setChecklistForm10}
          onFormChange={handleChecklistFormChange}
        />
      </FormSectionAccordion>

      {/* Form 11 */}
      <FormSectionAccordion
        menuKey="form11"
        title="FORM 11: Technical Install & Commission - Miscellaneous Equipment"
      >
        <DynamicForm
          checkListForm={checklistForm11}
          list={listForm11}
          setChecklistForm={setChecklistForm11}
          onFormChange={handleChecklistFormChange}
        />
      </FormSectionAccordion>

      <div className="space-x-4 mt-4 mx-auto">
        <Button isIconOnly color="success" type="submit">
          <FileOutput />
        </Button>
        <Button
          isIconOnly
          color="success"
          type="button"
          variant="bordered"
          onClick={handleSaveAndContinue}
        >
          <Save />
        </Button>
        {!isNew && (
          <Button
            isIconOnly
            color="primary"
            type="button"
            variant="bordered"
            onClick={handleGeneratePDF}
          >
            <Download />
          </Button>
        )}
        <Button
          isIconOnly
          color="danger"
          type="button"
          variant="bordered"
          onClick={handleCancelClick}
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
  );
};
