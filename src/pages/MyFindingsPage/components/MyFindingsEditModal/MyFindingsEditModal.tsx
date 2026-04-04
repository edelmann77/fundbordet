import { Button, TextInput } from "fundbrdet-ui";
import { useTranslation } from "react-i18next";
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
  selectedFindingId: string;
  onCancel: () => void;
  onSave: () => void;
  onEditChange: (field: keyof Finding, value: string) => void;
  onMapClick: (event: MapMouseEvent) => void;
  onMapZoom: (event: ViewStateChangeEvent) => void;
}> = ({
  editValues,
  saving,
  mapRef,
  mapFindings,
  mapBounds,
  selectedFindingId,
  onCancel,
  onSave,
  onEditChange,
  onMapClick,
  onMapZoom,
}) => {
  const { t } = useTranslation();
  const modalTitle =
    editValues.genstand || editValues.materiale || t("myFindings.unnamed");

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
                    <div>
                      <h4 className="my-findings__modal-panel-title">
                        {t("myFindings.imagesHeading")}
                      </h4>
                    </div>
                    <span className="my-findings__modal-soon-badge">
                      {t("myFindings.addImagesSoon")}
                    </span>
                  </div>

                  <div className="my-findings__image-dropzone" aria-hidden="true">
                    <div className="my-findings__image-dropzone-icon">+</div>
                    <p className="my-findings__image-dropzone-title">
                      {t("myFindings.imagesDropzoneTitle")}
                    </p>
                    <p className="my-findings__image-dropzone-copy">
                      {t("myFindings.imagesDropzoneCopy")}
                    </p>
                  </div>

                  <div className="my-findings__image-grid" aria-hidden="true">
                    {imageSlotLabels.map((labelKey, index) => (
                      <div
                        key={`${labelKey}-${index}`}
                        className={
                          index === 0
                            ? "my-findings__image-slot my-findings__image-slot--feature"
                            : "my-findings__image-slot"
                        }
                      >
                        <span className="my-findings__image-slot-badge">
                          {index + 1}
                        </span>
                        <span className="my-findings__image-slot-label">
                          {t(labelKey)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="my-findings__modal-footnote">
                    {t("myFindings.imagesFootnote")}
                  </p>

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
