import { QuickbaseInputsProps } from "@/src/interfaces/reports";

import { FormInput } from "../ui/formInput";

export default function QuickbaseInputs({
  formData,
  handleChange,
}: QuickbaseInputsProps) {
  return (
    <>
      {/* Client Data */}
      <div className="grid grid-cols-3 gap-8">
        <FormInput
          label="Job"
          name="jde_job"
          placeholder="XXXXXXX"
          value={formData.jde_job}
          onChange={handleChange}
        />
        <FormInput
          label="Client Company"
          name="client_company"
          placeholder="Acme Inc."
          value={formData.client_company}
          onChange={handleChange}
        />
        <FormInput
          label="Client Name"
          name="client_name"
          placeholder="Freddy Mercury"
          value={formData.client_name}
          onChange={handleChange}
        />
      </div>

      {/* JDE Job, Job Description, Design Standard */}
      <div className="grid grid-cols-3 gap-8">
        <FormInput
          label="Job Revision"
          name="job_revision"
          placeholder="XX"
          value={formData.job_revision}
          onChange={handleChange}
        />
        <FormInput
          label="Job Description"
          name="job_description"
          placeholder="PCI XXX"
          value={formData.job_description}
          onChange={handleChange}
        />
        <FormInput
          label="Design Standard"
          name="design_standard"
          placeholder="CSA XXX"
          value={formData.design_standard}
          onChange={handleChange}
        />
      </div>

      {/* Site Data */}
      <div className="grid grid-cols-3 gap-8">
        <FormInput
          label="Site Name"
          name="site_name"
          placeholder="Picadilly Circus"
          value={formData.site_name}
          onChange={handleChange}
        />
        <FormInput
          label="Site Code"
          name="site_code"
          placeholder="C0XXXX"
          value={formData.site_code}
          onChange={handleChange}
        />
        <FormInput
          label="Site Region"
          name="site_region"
          placeholder="Westeros"
          value={formData.site_region}
          onChange={handleChange}
        />
      </div>

      {/* Tower Data */}
      <div className="grid grid-cols-3 gap-8">
        <FormInput
          label="Tower ID"
          name="tower_id"
          placeholder="XX-XXXX"
          value={formData.tower_id}
          onChange={handleChange}
        />
        <FormInput
          label="Standard Tower Name"
          name="tower_name"
          placeholder="LRTXXXX"
          value={formData.tower_name}
          onChange={handleChange}
        />
        <FormInput
          label="Tower Site Name"
          name="tower_site_name"
          placeholder="Big Ben"
          value={formData.tower_site_name}
          onChange={handleChange}
        />
      </div>

      {/* Misc */}
      <div className="grid grid-cols-3 gap-8">
        <FormInput
          label="Redline Pages Count"
          name="redline_pages"
          placeholder="XX"
          type="number"
          value={formData.redline_pages}
          onChange={handleChange}
        />
        {/* <FormInput
          label="Standard Tower Name"
          name="tower_name"
          placeholder="LRTXXXX"
          value={formData.tower_name}
          onChange={handleChange}
        /> */}
      </div>
    </>
  );
}
