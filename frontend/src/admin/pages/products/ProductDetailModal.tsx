import { useTranslation } from "react-i18next";
import { Modal } from "@/admin/components/ui/Modal";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/admin/components/ui/Accordion";
import { useProduct } from "@/admin/hooks/api/useProducts";

interface ProductDetailModalProps {
  productId: string | null;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="text-right font-medium text-neutral-800">{value}</span>
    </div>
  );
}

export function ProductDetailModal({ productId, onOpenChange }: ProductDetailModalProps) {
  const { t } = useTranslation();
  const { data: product, isLoading } = useProduct(productId);

  return (
    <Modal open={Boolean(productId)} onOpenChange={onOpenChange} title={product?.name ?? t("productDetail.title")} size="lg">
      {isLoading || !product ? (
        <p className="py-10 text-center text-neutral-400">{t("common.loading")}</p>
      ) : (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <StatusBadge status={product.status} />
            <span className="text-xs text-neutral-400">{product.sku}</span>
          </div>

          <Accordion type="multiple" defaultValue={["photos", "basic", "pricing"]}>
            <AccordionItem value="photos" className="border-b border-neutral-100">
              <AccordionTrigger>{t("productDetail.photos")}</AccordionTrigger>
              <AccordionContent>
                {product.images.length === 0 ? (
                  <p className="text-sm text-neutral-400">{t("productDetail.noPhotos")}</p>
                ) : (
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                    {product.images.map((img) => (
                      <img
                        key={img.id}
                        src={img.url}
                        alt={product.name}
                        className={`aspect-[3/4] w-full rounded-lg object-cover ${img.isPrimary ? "ring-2 ring-royal-500" : ""}`}
                      />
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="basic" className="border-b border-neutral-100">
              <AccordionTrigger>{t("productDetail.basicInfo")}</AccordionTrigger>
              <AccordionContent>
                <DetailRow label={t("common.title")} value={product.name} />
                <DetailRow label={t("common.slug")} value={product.slug} />
                <DetailRow
                  label={t("productForm.category")}
                  value={product.categories.map((c) => c.category.name).join(", ") || undefined}
                />
                {product.shortDescription && (
                  <div className="py-1">
                    <p className="text-sm text-neutral-500">{t("productForm.shortDescription")}</p>
                    <p className="mt-0.5 text-sm text-neutral-800">{product.shortDescription}</p>
                  </div>
                )}
                {product.description && (
                  <div className="py-1">
                    <p className="text-sm text-neutral-500">{t("common.description")}</p>
                    <p className="mt-0.5 whitespace-pre-wrap text-sm text-neutral-800">{product.description}</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pricing" className="border-b border-neutral-100">
              <AccordionTrigger>{t("productDetail.pricingAndStock")}</AccordionTrigger>
              <AccordionContent>
                <DetailRow label={t("productForm.mrp")} value={`₹${Number(product.mrp).toLocaleString("en-IN")}`} />
                <DetailRow label={t("productForm.sellingPrice")} value={`₹${Number(product.sellingPrice).toLocaleString("en-IN")}`} />
                <DetailRow label={t("productForm.gst")} value={`${product.gstPercent}%`} />
                <DetailRow label={t("productForm.stockQuantity")} value={product.stockQuantity} />
                <DetailRow label={t("productForm.lowStockThreshold")} value={product.lowStockThreshold} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="craft" className="border-b border-neutral-100">
              <AccordionTrigger>{t("productForm.craftDetails")}</AccordionTrigger>
              <AccordionContent>
                <DetailRow label={t("productForm.fabric")} value={product.fabric} />
                <DetailRow label={t("productForm.color")} value={product.color} />
                <DetailRow label={t("productForm.sareeLength")} value={product.sareeLength ? `${product.sareeLength} m` : undefined} />
                <DetailRow label={t("productForm.weavingTechnique")} value={product.weavingTechnique} />
                <DetailRow label={t("productForm.borderType")} value={product.borderType} />
                <DetailRow label={t("productForm.palluDesign")} value={product.palluDesign} />
                <DetailRow label={t("productForm.blouseLength")} value={product.blouseLength ? `${product.blouseLength} m` : undefined} />
                <DetailRow label={t("productForm.weightGrams")} value={product.weightGrams} />
                <DetailRow label={t("productForm.blouseIncluded")} value={product.blouseIncluded ? t("common.yes") : t("common.no")} />
                {product.washCare && (
                  <div className="py-1">
                    <p className="text-sm text-neutral-500">{t("productForm.washCare")}</p>
                    <p className="mt-0.5 text-sm text-neutral-800">{product.washCare}</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {product.variants.length > 0 && (
              <AccordionItem value="variants" className="border-b border-neutral-100">
                <AccordionTrigger>{t("variantsCard.title")}</AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-hidden rounded-lg border border-neutral-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="px-3 py-2 font-medium text-neutral-600">{t("variantsCard.variant")}</th>
                          <th className="px-3 py-2 font-medium text-neutral-600">{t("variantsCard.sku")}</th>
                          <th className="px-3 py-2 font-medium text-neutral-600">{t("variantsCard.priceAdjustment")}</th>
                          <th className="px-3 py-2 font-medium text-neutral-600">{t("variantsCard.stock")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.variants.map((v) => (
                          <tr key={v.id} className="border-t border-neutral-100">
                            <td className="px-3 py-2 text-neutral-700">{[v.color, v.size].filter(Boolean).join(" / ")}</td>
                            <td className="px-3 py-2 text-neutral-500">{v.sku}</td>
                            <td className="px-3 py-2 text-neutral-500">₹{Number(v.priceDelta).toLocaleString("en-IN")}</td>
                            <td className="px-3 py-2 text-neutral-500">{v.stockQuantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="merchandising">
              <AccordionTrigger>{t("productForm.merchandising")}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    product.isFeatured && t("productForm.featured"),
                    product.isNewArrival && t("productForm.newArrival"),
                    product.isBestSeller && t("productForm.bestseller"),
                    product.isTodaysDeal && t("productForm.todaysDeal"),
                    product.isLiveSpecial && t("productForm.liveSpecialToday"),
                    product.isTopSelection && t("productForm.topSelection"),
                    product.isHandloom && t("productForm.handloom"),
                  ]
                    .filter(Boolean)
                    .map((label) => (
                      <span key={label as string} className="rounded-full bg-royal-50 px-2.5 py-1 text-xs font-medium text-royal-700">
                        {label}
                      </span>
                    ))}
                  {product.tags?.map((t2) => (
                    <span key={t2.tag.id} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                      {t2.tag.name}
                    </span>
                  ))}
                  {!product.isFeatured &&
                    !product.isNewArrival &&
                    !product.isBestSeller &&
                    !product.isTodaysDeal &&
                    !product.isLiveSpecial &&
                    !product.isTopSelection &&
                    !product.isHandloom &&
                    !product.tags?.length && <p className="text-sm text-neutral-400">{t("productDetail.noMerchandisingLabels")}</p>}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </Modal>
  );
}
