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

  return (
    <div className="my-findings__modal" role="dialog" aria-modal="true">
      <div className="my-findings__modal-backdrop" onClick={onCancel} />
      <div className="my-findings__modal-content">
        <div className="my-findings__modal-header">
          <h3 className="my-findings__modal-title">
            {editValues.genstand ||
              editValues.materiale ||
              t("myFindings.unnamed")}
          </h3>
          <button
            className="my-findings__modal-close"
            onClick={onCancel}
            aria-label={t("myFindings.close")}
          >
            ✕
          </button>
        </div>

        <div className="my-findings__detail-edit">
          <div className="my-findings__detail-form">
            <TextInput
              label={t("registerFinding.genstand")}
              value={editValues.genstand || ""}
              onChange={(event) => onEditChange("genstand", event.target.value)}
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
              onChange={(event) => onEditChange("datering", event.target.value)}
              size="md"
            />
            <TextInput
              label={t("registerFinding.oest")}
              value={editValues.oest?.toString() || ""}
              onChange={(event) => onEditChange("oest", event.target.value)}
              size="md"
            />
            <TextInput
              label={t("registerFinding.nord")}
              value={editValues.nord?.toString() || ""}
              onChange={(event) => onEditChange("nord", event.target.value)}
              size="md"
            />
            <TextInput
              label={t("registerFinding.dimeId")}
              value={editValues.dime_id || ""}
              onChange={(event) => onEditChange("dime_id", event.target.value)}
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
