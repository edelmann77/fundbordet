import { Button, TextInput } from "fundbrdet-ui";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import type {
  MapMouseEvent,
  MapRef,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import type { RefObject } from "react";
import type { Finding } from "../../../../hooks/useFindings";
import type { FindingWithCoordinates } from "../../myFindingsUtils";
import { MyFindingsMap } from "../MyFindingsMap/MyFindingsMap";

const imageSlotLabels = [
  "myFindings.coverImage",
  "myFindings.galleryImage",
  "myFindings.galleryImage",
] as const;

export const MyFindingsEditModal: React.FC<{
  editValues: Partial<Finding>;
  saving: boolean;
  mapRef: RefObject<MapRef | null>;
  mapFindings: FindingWithCoordinates[];
  mapBounds: { center: [number, number]; zoom: number };
  selectedImages: File[];
  selectedFindingId: string;
  onCancel: () => void;
  onSave: () => void;
  onEditChange: (field: keyof Finding, value: string) => void;
  onImagesChange: (images: File[]) => void;
  onMapClick: (event: MapMouseEvent) => void;
  onMapZoom: (event: ViewStateChangeEvent) => void;
}> = ({
  editValues,
  saving,
  mapRef,
  mapFindings,
  mapBounds,
  selectedImages,
  selectedFindingId,
  onCancel,
  onSave,
  onEditChange,
  onImagesChange,
  onMapClick,
  onMapZoom,
}) => {
  const { t } = useTranslation();
  const modalTitle =
    editValues.genstand || editValues.materiale || t("myFindings.unnamed");
  const previewImages = useMemo(
    () =>
      selectedImages.map((image) => ({
        file: image,
        url: URL.createObjectURL(image),
      })),
    [selectedImages],
  );

  useEffect(() => {
    return () => {
      for (const previewImage of previewImages) {
        URL.revokeObjectURL(previewImage.url);
      }
    };
  }, [previewImages]);

  const handleImageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    onImagesChange(
      [...selectedImages, ...files].slice(0, imageSlotLabels.length),
    );
    event.target.value = "";
  };

  return (
    <div className="my-findings__modal" role="dialog" aria-modal="true">
      <div className="my-findings__modal-backdrop" onClick={onCancel} />
      <div className="my-findings__modal-content">
        <div className="my-findings__modal-header">
          <div className="my-findings__modal-heading">
            <span className="my-findings__modal-eyebrow">
              {t("myFindings.edit")}
            </span>
            <h3 className="my-findings__modal-title">{modalTitle}</h3>
          </div>
          <button
            className="my-findings__modal-close"
            onClick={onCancel}
            aria-label={t("myFindings.close")}
          >
            ✕
          </button>
        </div>

        <div className="my-findings__detail-edit">
          <div className="my-findings__modal-body">
            <div className="my-findings__modal-layout">
              <div className="my-findings__modal-main">
                <section className="my-findings__modal-panel my-findings__modal-panel--form">
                  <div className="my-findings__modal-panel-header">
                    <div>
                      <h4 className="my-findings__modal-panel-title">
                        {t("myFindings.detailsSection")}
                      </h4>
                      <p className="my-findings__modal-panel-copy">
                        {t("myFindings.detailsDescription")}
                      </p>
                    </div>
                  </div>

                  <div className="my-findings__detail-form my-findings__detail-form-grid">
                    <TextInput
                      label={t("registerFinding.genstand")}
                      value={editValues.genstand || ""}
                      onChange={(event) =>
                        onEditChange("genstand", event.target.value)
                      }
                      size="md"
                    />
                    <TextInput
                      label={t("registerFinding.materiale")}
                      value={editValues.materiale || ""}
                      onChange={(event) =>
                        onEditChange("materiale", event.target.value)
                      }
                      size="md"
                    />
                    <TextInput
                      label={t("registerFinding.datering")}
                      value={editValues.datering || ""}
                      onChange={(event) =>
                        onEditChange("datering", event.target.value)
                      }
                      size="md"
                    />
                    <TextInput
                      label={t("registerFinding.dimeId")}
                      value={editValues.dime_id || ""}
                      onChange={(event) =>
                        onEditChange("dime_id", event.target.value)
                      }
                      size="md"
                    />
                  </div>
                </section>

                <section className="my-findings__modal-panel my-findings__modal-panel--location">
                  <div className="my-findings__modal-panel-header">
                    <div>
                      <h4 className="my-findings__modal-panel-title">
                        {t("myFindings.locationSection")}
                      </h4>
                      <p className="my-findings__modal-panel-copy">
                        {t("myFindings.locationDescription")}
                      </p>
                    </div>
                  </div>

                  <div className="my-findings__detail-form my-findings__detail-form-grid my-findings__detail-form-grid--compact">
                    <TextInput
                      label={t("registerFinding.oest")}
                      value={editValues.oest?.toString() || ""}
                      onChange={(event) =>
                        onEditChange("oest", event.target.value)
                      }
                      size="md"
                    />
                    <TextInput
                      label={t("registerFinding.nord")}
                      value={editValues.nord?.toString() || ""}
                      onChange={(event) =>
                        onEditChange("nord", event.target.value)
                      }
                      size="md"
                    />
                  </div>

                  <div className="my-findings__detail-map-container">
                    <div className="my-findings__detail-map">
                      <MyFindingsMap
                        mapRef={mapRef}
                        findings={mapFindings}
                        selectedFindingId={selectedFindingId}
                        center={mapBounds.center}
                        zoom={mapBounds.zoom}
                        interactive
                        onClick={onMapClick}
                        onZoom={onMapZoom}
                      />
                    </div>
                    <p className="my-findings__modal-map-hint">
                      {t("myFindings.mapHint")}
                    </p>
                  </div>
                </section>
              </div>

              <aside className="my-findings__modal-sidepanel">
                <section className="my-findings__modal-panel my-findings__modal-panel--media">
                  <div className="my-findings__modal-panel-header">
                    <h4 className="my-findings__modal-panel-title">
                      {t("myFindings.imagesHeading")}
                    </h4>
                    {selectedImages.length > 0 && (
                      <button
                        type="button"
                        className="my-findings__modal-link-button"
                        onClick={() => onImagesChange([])}
                      >
                        {t("myFindings.clearImages")}
                      </button>
                    )}
                  </div>

                  <label className="my-findings__image-dropzone">
                    <input
                      className="my-findings__image-input"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageInputChange}
                    />
                    <div className="my-findings__image-dropzone-icon">+</div>
                    <p className="my-findings__image-dropzone-title">
                      {t("myFindings.imagesDropzoneTitle")}
                    </p>
                    <p className="my-findings__image-dropzone-copy">
                      {t("myFindings.imagesDropzoneCopy", {
                        count: imageSlotLabels.length,
                      })}
                    </p>
                  </label>

                  <div className="my-findings__image-grid">
                    {imageSlotLabels.map((labelKey, index) => (
                      <div
                        key={`${labelKey}-${index}`}
                        className={
                          index === 0
                            ? `my-findings__image-slot my-findings__image-slot--feature${previewImages[index] ? " my-findings__image-slot--filled" : ""}`
                            : `my-findings__image-slot${previewImages[index] ? " my-findings__image-slot--filled" : ""}`
                        }
                      >
                        {previewImages[index] && (
                          <img
                            className="my-findings__image-slot-preview"
                            src={previewImages[index].url}
                            alt={previewImages[index].file.name}
                          />
                        )}
                        <span className="my-findings__image-slot-badge">
                          {index + 1}
                        </span>
                        <span className="my-findings__image-slot-label">
                          {previewImages[index]?.file.name ?? t(labelKey)}
                        </span>
                      </div>
                    ))}
                  </div>

                </section>
              </aside>
            </div>
          </div>

          <div className="my-findings__detail-actions">
            <Button onClick={onSave} disabled={saving} variant="primary">
              {saving ? t("myFindings.saving") : t("registerFinding.save")}
            </Button>
            <Button onClick={onCancel} variant="secondary">
              {t("registerFinding.cancel")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFindingsEditModal;
