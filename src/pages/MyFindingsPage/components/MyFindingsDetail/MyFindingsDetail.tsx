import { Button } from "fundbrdet-ui";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState, type RefObject } from "react";
import type {
  MapMouseEvent,
  MapRef,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import type { FriendRecord } from "../../../../hooks/useFriendSearch";
import {
  getFindingImageUrl,
  type Finding,
  useFindingImageUids,
} from "../../../../hooks/useFindings";
import type { FindingWithCoordinates } from "../../myFindingsUtils";
import { isValidUTM } from "../../myFindingsUtils";
import { MyFindingsEditModal } from "../MyFindingsEditModal/MyFindingsEditModal";
import { MyFindingsMap } from "../MyFindingsMap/MyFindingsMap";

export const MyFindingsDetail: React.FC<{
  selectedFinding: Finding | null;
  editValues: Partial<Finding> | null;
  isEditing: boolean;
  saving: boolean;
  confirmedFriends: FriendRecord[];
  mapRef: RefObject<MapRef | null>;
  mapFindings: FindingWithCoordinates[];
  mapBounds: { center: [number, number]; zoom: number };
  shareError: string | null;
  sharedFriendIds: string[];
  sharesLoading: boolean;
  sharesSaving: boolean;
  selectedImages: File[];
  onStartEditing: () => void;
  onCancel: () => void;
  onSave: () => void;
  onShareChange: (friendIds: string[]) => Promise<void>;
  onEditChange: (field: keyof Finding, value: string) => void;
  onImagesChange: (images: File[]) => void;
  onMapClick: (event: MapMouseEvent) => void;
  onMapZoom: (event: ViewStateChangeEvent) => void;
}> = ({
  selectedFinding,
  editValues,
  isEditing,
  saving,
  confirmedFriends,
  mapRef,
  mapFindings,
  mapBounds,
  shareError,
  sharedFriendIds,
  sharesLoading,
  sharesSaving,
  selectedImages,
  onStartEditing,
  onCancel,
  onSave,
  onShareChange,
  onEditChange,
  onImagesChange,
  onMapClick,
  onMapZoom,
}) => {
  const { t } = useTranslation();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [shareSelection, setShareSelection] =
    useState<string[]>(sharedFriendIds);
  const shareMenuRef = useRef<HTMLDivElement | null>(null);
  const { imageUids } = useFindingImageUids(
    selectedFinding?.id ?? null,
    isEditing ? "editing" : "view",
  );
  const detailValues: Partial<Finding> = editValues ?? {};
  const isOwnerFinding = selectedFinding?.accessLevel !== "shared";

  const hasValidCoordinates =
    detailValues.oest != null &&
    detailValues.nord != null &&
    isValidUTM(Number(detailValues.oest), Number(detailValues.nord));
  const imageUrls = imageUids.map((uid) => ({
    uid,
    url: getFindingImageUrl(uid),
  }));
  const selectedFindingTitle =
    detailValues.genstand || detailValues.materiale || t("myFindings.unnamed");
  const hasImages = imageUrls.length > 0;
  const hasMedia = hasValidCoordinates || hasImages;
  const activeImage =
    activeImageIndex != null ? (imageUrls[activeImageIndex] ?? null) : null;
  const activeImageNumber = activeImageIndex != null ? activeImageIndex + 1 : 1;

  useEffect(() => {
    setShareSelection(sharedFriendIds);
  }, [sharedFriendIds, selectedFinding?.id]);

  useEffect(() => {
    if (!shareMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setShareMenuOpen(false);
        setShareSelection(sharedFriendIds);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [shareMenuOpen, sharedFriendIds]);

  useEffect(() => {
    if (activeImageIndex == null) {
      return;
    }

    if (activeImageIndex >= imageUrls.length) {
      setActiveImageIndex(imageUrls.length > 0 ? 0 : null);
    }
  }, [activeImageIndex, imageUrls.length]);

  useEffect(() => {
    if (activeImage == null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImageIndex(null);
      }

      if (imageUrls.length > 1 && event.key === "ArrowRight") {
        setActiveImageIndex((currentIndex) => {
          if (currentIndex == null) {
            return 0;
          }

          return (currentIndex + 1) % imageUrls.length;
        });
      }

      if (imageUrls.length > 1 && event.key === "ArrowLeft") {
        setActiveImageIndex((currentIndex) => {
          if (currentIndex == null) {
            return imageUrls.length - 1;
          }

          return (currentIndex - 1 + imageUrls.length) % imageUrls.length;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImage, imageUrls.length]);

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

  return (
    <div className="my-findings__detail-content">
      <div className="my-findings__detail-header">
        <div className="my-findings__detail-heading">
          <h2 className="my-findings__detail-title">{selectedFindingTitle}</h2>
          {selectedFinding.accessLevel === "shared" &&
            selectedFinding.sharedByEmail && (
              <p className="my-findings__detail-subtitle">
                {t("myFindings.sharedBy", {
                  email: selectedFinding.sharedByEmail,
                })}
              </p>
            )}
        </div>

        {isOwnerFinding && (
          <div className="my-findings__detail-share" ref={shareMenuRef}>
            <button
              type="button"
              className="my-findings__detail-share-trigger"
              aria-expanded={shareMenuOpen}
              aria-haspopup="dialog"
              aria-label={t("myFindings.shareAction")}
              onClick={() => {
                setShareSelection(sharedFriendIds);
                setShareMenuOpen((currentOpen) => !currentOpen);
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="m8.6 13.5 6.8 4" />
                <path d="m15.4 6.5-6.8 4" />
              </svg>
            </button>

            {shareMenuOpen && (
              <div className="my-findings__detail-share-menu" role="dialog">
                <div className="my-findings__detail-share-menu-header">
                  <span className="my-findings__detail-label">
                    {t("myFindings.shareTitle")}
                  </span>
                  <span className="my-findings__detail-images-count">
                    {shareSelection.length}
                  </span>
                </div>

                {sharesLoading ? (
                  <p className="my-findings__detail-share-empty">
                    {t("myFindings.shareLoading")}
                  </p>
                ) : confirmedFriends.length === 0 ? (
                  <p className="my-findings__detail-share-empty">
                    {t("myFindings.shareEmpty")}
                  </p>
                ) : (
                  <div className="my-findings__detail-share-list">
                    {confirmedFriends.map((friend) => {
                      const isSelected = shareSelection.includes(
                        friend.counterpartUserId,
                      );

                      return (
                        <label
                          key={friend.counterpartUserId}
                          className="my-findings__detail-share-option"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setShareSelection((currentSelection) => {
                                if (
                                  currentSelection.includes(
                                    friend.counterpartUserId,
                                  )
                                ) {
                                  return currentSelection.filter(
                                    (userId) =>
                                      userId !== friend.counterpartUserId,
                                  );
                                }

                                return [
                                  ...currentSelection,
                                  friend.counterpartUserId,
                                ];
                              });
                            }}
                          />
                          <span className="my-findings__detail-share-option-copy">
                            <span className="my-findings__detail-share-option-email">
                              {friend.email}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {shareError && (
                  <p className="my-findings__detail-share-error" role="alert">
                    {shareError}
                  </p>
                )}

                <div className="my-findings__detail-share-actions">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShareSelection(sharedFriendIds);
                      setShareMenuOpen(false);
                    }}
                  >
                    {t("registerFinding.cancel")}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    loading={sharesSaving}
                    disabled={sharesLoading}
                    onClick={() => {
                      void (async () => {
                        try {
                          await onShareChange(shareSelection);
                          setShareMenuOpen(false);
                        } catch {
                          // keep the menu open so the user can correct the selection
                        }
                      })();
                    }}
                  >
                    {t("myFindings.shareSave")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="my-findings__detail-view">
        <section className="my-findings__detail-meta-section">
          <div className="my-findings__detail-images-header">
            <span className="my-findings__detail-label">
              {t("myFindings.detailsSection")}
            </span>
          </div>
          <div className="my-findings__detail-fields">
            <div className="my-findings__detail-field">
              <span className="my-findings__detail-label">
                {t("registerFinding.genstand")}
              </span>
              <span className="my-findings__detail-value">
                {detailValues.genstand || "—"}
              </span>
            </div>
            <div className="my-findings__detail-field">
              <span className="my-findings__detail-label">
                {t("registerFinding.materiale")}
              </span>
              <span className="my-findings__detail-value">
                {detailValues.materiale || "—"}
              </span>
            </div>
            <div className="my-findings__detail-field">
              <span className="my-findings__detail-label">
                {t("registerFinding.datering")}
              </span>
              <span className="my-findings__detail-value">
                {detailValues.datering || "—"}
              </span>
            </div>
            {(detailValues.oest || detailValues.nord) && (
              <>
                <div className="my-findings__detail-field">
                  <span className="my-findings__detail-label">
                    {t("registerFinding.oest")}
                  </span>
                  <span className="my-findings__detail-value">
                    {detailValues.oest || "—"}
                  </span>
                </div>
                <div className="my-findings__detail-field">
                  <span className="my-findings__detail-label">
                    {t("registerFinding.nord")}
                  </span>
                  <span className="my-findings__detail-value">
                    {detailValues.nord || "—"}
                  </span>
                </div>
              </>
            )}
            {detailValues.dime_id && (
              <div className="my-findings__detail-field">
                <span className="my-findings__detail-label">
                  {t("registerFinding.dimeId")}
                </span>
                <span className="my-findings__detail-value">
                  {detailValues.dime_id}
                </span>
              </div>
            )}
          </div>
        </section>

        {hasMedia && (
          <div
            className={
              hasValidCoordinates && hasImages
                ? "my-findings__detail-media"
                : "my-findings__detail-media my-findings__detail-media--single"
            }
          >
            {hasValidCoordinates && (
              <section className="my-findings__detail-map-section">
                <div className="my-findings__detail-images-header">
                  <span className="my-findings__detail-label">
                    {t("myFindings.locationSection")}
                  </span>
                </div>
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
              </section>
            )}

            {hasImages && (
              <section className="my-findings__detail-images-section">
                <div className="my-findings__detail-images-header">
                  <span className="my-findings__detail-label">
                    {t("myFindings.imagesHeading")}
                  </span>
                  <span className="my-findings__detail-images-count">
                    {imageUrls.length}
                  </span>
                </div>
                <p className="my-findings__detail-images-hint">
                  {t("myFindings.openImageHint")}
                </p>
                <div className="my-findings__detail-images-grid" role="list">
                  {imageUrls.map(({ uid, url }, index) => (
                    <button
                      key={uid}
                      type="button"
                      className="my-findings__detail-image-card"
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={t("myFindings.openImage", {
                        index: index + 1,
                      })}
                    >
                      <img
                        className="my-findings__detail-image"
                        src={url}
                        alt={`${selectedFindingTitle} ${index + 1}`}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {isOwnerFinding && (
          <div className="my-findings__detail-actions">
            <Button onClick={onStartEditing} variant="primary">
              {t("myFindings.edit")}
            </Button>
          </div>
        )}
      </div>

      {isEditing && (
        <MyFindingsEditModal
          editValues={editValues}
          saving={saving}
          mapRef={mapRef}
          mapFindings={mapFindings}
          mapBounds={mapBounds}
          existingImageUids={imageUids}
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

      {activeImage && (
        <div
          className="my-findings__detail-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t("myFindings.imagesHeading")}
          onClick={() => setActiveImageIndex(null)}
        >
          <button
            type="button"
            className="my-findings__detail-lightbox-close"
            onClick={() => setActiveImageIndex(null)}
            aria-label={t("myFindings.closeImageViewer")}
          >
            ×
          </button>

          {imageUrls.length > 1 && (
            <>
              <button
                type="button"
                className="my-findings__detail-lightbox-nav my-findings__detail-lightbox-nav--prev"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImageIndex((currentIndex) => {
                    if (currentIndex == null) {
                      return imageUrls.length - 1;
                    }

                    return (
                      (currentIndex - 1 + imageUrls.length) % imageUrls.length
                    );
                  });
                }}
                aria-label={t("myFindings.previousImage")}
              >
                ‹
              </button>
              <button
                type="button"
                className="my-findings__detail-lightbox-nav my-findings__detail-lightbox-nav--next"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImageIndex((currentIndex) => {
                    if (currentIndex == null) {
                      return 0;
                    }

                    return (currentIndex + 1) % imageUrls.length;
                  });
                }}
                aria-label={t("myFindings.nextImage")}
              >
                ›
              </button>
            </>
          )}

          <div
            className="my-findings__detail-lightbox-stage"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="my-findings__detail-lightbox-image"
              src={activeImage.url}
              alt={`${selectedFindingTitle} ${activeImageNumber}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFindingsDetail;
