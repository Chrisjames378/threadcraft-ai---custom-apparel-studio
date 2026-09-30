import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { GarmentConfig, PrintMethod } from '../types/apparel';
import { X, ShoppingBag, CheckCircle, Truck, ShieldCheck, Tag } from 'lucide-react';

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  garment: GarmentConfig;
  color: string;
  printMethod: PrintMethod;
  layersCount: number;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

export const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({
  isOpen,
  onClose,
  garment,
  color,
  printMethod,
  layersCount,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [quantity, setQuantity] = useState<number>(1);
  const [isOrdered, setIsOrdered] = useState<boolean>(false);

  if (!isOpen) return null;

  // Pricing Calculation
  const basePrice = garment.basePrice;
  let printExtra = layersCount > 1 ? (layersCount - 1) * 3 : 0;
  if (printMethod === 'embroidery') printExtra += 6;
  if (printMethod === 'vinyl-foil') printExtra += 4;
  if (printMethod === 'screenprint') printExtra += 2;

  const unitPrice = basePrice + printExtra;

  // Bulk Discount
  let discountRate = 0;
  if (quantity >= 100) discountRate = 0.35;
  else if (quantity >= 50) discountRate = 0.2;
  else if (quantity >= 10) discountRate = 0.1;

  const subtotal = unitPrice * quantity;
  const discountAmount = subtotal * discountRate;
  const shipping = quantity >= 5 ? 0 : 8;
  const finalTotal = subtotal - discountAmount + shipping;

  const handleCompleteOrder = () => {
    setIsOrdered(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Order Your Custom Apparel</h2>
              <p className="text-xs text-zinc-400">{garment.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isOrdered ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Custom Order Placed!</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
              Your custom apparel design has been queued for production. We'll send tracking information once printing is complete!
            </p>
            <button
              onClick={() => {
                setIsOrdered(false);
                onClose();
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all"
            >
              Back to Studio
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Size Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Select Garment Size
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedSize === size
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Order Quantity (Units)
                </label>
                {discountRate > 0 && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    {discountRate * 100}% Bulk Savings Applied!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-mono font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="flex gap-1.5 text-[11px]">
                  {[1, 10, 50, 100].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuantity(q)}
                      className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                        quantity === q
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {q} pcs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Unit Base Price ({garment.name})</span>
                <span className="font-mono text-zinc-200">${basePrice.toFixed(2)}</span>
              </div>

              {printExtra > 0 && (
                <div className="flex justify-between text-zinc-400">
                  <span>Custom Print / Embroidery Surcharge</span>
                  <span className="font-mono text-zinc-200">+${printExtra.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-400">
                <span>Subtotal ({quantity} items @ ${unitPrice.toFixed(2)})</span>
                <span className="font-mono text-zinc-200">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Bulk Discount ({discountRate * 100}%)</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-400">
                <span>Production Express Shipping</span>
                <span className="font-mono text-zinc-200">
                  {shipping === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-sm font-bold text-white">
                <span>Estimated Total</span>
                <span className="text-lg font-mono text-indigo-400">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Guarantee */}
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>100% Quality Print Guarantee • Fast 3-Day Turnaround</span>
            </div>

            {/* Submit */}
            <button
              onClick={handleCompleteOrder}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Place Order (${finalTotal.toFixed(2)})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
