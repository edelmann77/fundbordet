import { Button } from "fundbrdet-ui";
import { useTranslation } from "react-i18next";
import type { RefObject } from "react";
import type {
  MapMouseEvent,
  MapRef,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import type { Finding } from "../../../../hooks/useFindings";
import type { FindingWithCoordinates } from "../../myFindingsUtils";
import { isValidUTM } from "../../myFindingsUtils";
import { MyFindingsEditModal } from "../MyFindingsEditModal/MyFindingsEditModal";
import { MyFindingsMap } from "../MyFindingsMap/MyFindingsMap";

export const MyFindingsDetail: React.FC<{
  selectedFinding: Finding | null;
  editValues: Partial<Finding> | null;
  isEditing: boolean;
  saving: boolean;
  mapRef: RefObject<MapRef | null>;
  mapFindings: FindingWithCoordinates[];
  mapBounds: { center: [number, number]; zoom: number };
  selectedImages: File[];
  onStartEditing: () => void;
  onCancel: () => void;
  onSave: () => void;
  onEditChange: (field: keyof Finding, value: string) => void;
  onImagesChange: (images: File[]) => void;
  onMapClick: (event: MapMouseEvent) => void;
  onMapZoom: (event: ViewStateChangeEvent) => void;
}> = ({
  selectedFinding,
  editValues,
  isEditing,
  saving,
  mapRef,
  mapFindings,
  mapBounds,
  selectedImages,
  onStartEditing,
  onCancel,
  onSave,
  onEditChange,
  onImagesChange,
  onMapClick,
  onMapZoom,
}) => {
  const { t } = useTranslation();

  if (!selectedFinding || !editValues) {
    return (
      <div className="my-findings__detail-empty">
        <svg
          className="my-findings__detail-empty-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 19 8 12 15 5" />
        </svg>
        <p className="my-findings__detail-empty-text">
          {t("myFindings.selectToView")}
        </p>
      </div>
    );
  }

  const hasValidCoordinates =
    editValues.oest != null &&
    editValues.nord != null &&
    isValidUTM(Number(editValues.oest), Number(editValues.nord));

  return (
    <div className="my-findings__detail-content">
      <div className="my-findings__detail-header">
        <h2 className="my-findings__detail-title">
          {editValues.genstand ||
            editValues.materiale ||
            t("myFindings.unnamed")}
        </h2>
      </div>

      <div className="my-findings__detail-view">
        <div className="my-findings__detail-fields">
          <div className="my-findings__detail-field">
            <span className="my-findings__detail-label">
              {t("registerFinding.genstand")}
            </span>
            <span className="my-findings__detail-value">
              {editValues.genstand || "—"}
            </span>
          </div>
          <div className="my-findings__detail-field">
            <span className="my-findings__detail-label">
              {t("registerFinding.materiale")}
            </span>
            <span className="my-findings__detail-value">
              {editValues.materiale || "—"}
            </span>
          </div>
          <div className="my-findings__detail-field">
            <span className="my-findings__detail-label">
              {t("registerFinding.datering")}
            </span>
            <span className="my-findings__detail-value">
              {editValues.datering || "—"}
            </span>
          </div>
          {(editValues.oest || editValues.nord) && (
            <>
              <div className="my-findings__detail-field">
                <span className="my-findings__detail-label">
                  {t("registerFinding.oest")}
                </span>
                <span className="my-findings__detail-value">
                  {editValues.oest || "—"}
                </span>
              </div>
              <div className="my-findings__detail-field">
                <span className="my-findings__detail-label">
                  {t("registerFinding.nord")}
                </span>
                <span className="my-findings__detail-value">
                  {editValues.nord || "—"}
                </span>
              </div>
            </>
          )}
          {editValues.dime_id && (
            <div className="my-findings__detail-field">
              <span className="my-findings__detail-label">
                {t("registerFinding.dimeId")}
              </span>
              <span className="my-findings__detail-value">
                {editValues.dime_id}
              </span>
            </div>
          )}
        </div>

        {hasValidCoordinates && (
          <div className="my-findings__detail-map-container">
            <div className="my-findings__detail-map">
              <MyFindingsMap
                mapRef={mapRef}
                findings={mapFindings}
                selectedFindingId={selectedFinding.id}
                center={mapBounds.center}
                zoom={mapBounds.zoom}
                interactive
              />
            </div>
          </div>
        )}

        <div className="my-findings__detail-actions">
          <Button onClick={onStartEditing} variant="primary">
            {t("myFindings.edit")}
          </Button>
        </div>
      </div>

      {isEditing && (
        <MyFindingsEditModal
          editValues={editValues}
          saving={saving}
          mapRef={mapRef}
          mapFindings={mapFindings}
          mapBounds={mapBounds}
          selectedImages={selectedImages}
          selectedFindingId={selectedFinding.id}
          onCancel={onCancel}
          onSave={onSave}
          onEditChange={onEditChange}
          onImagesChange={onImagesChange}
          onMapClick={onMapClick}
          onMapZoom={onMapZoom}
        />
      )}
    </div>
  );
};

export default MyFindingsDetail;
