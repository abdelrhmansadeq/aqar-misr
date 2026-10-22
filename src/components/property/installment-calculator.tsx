"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

export function InstallmentCalculator({ price }: { price: number }) {
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [years, setYears] = useState(5);

    // الحسابات
    const downPaymentAmount = (price * downPaymentPercent) / 100;
    const remainingAmount = price - downPaymentAmount;
    const months = years * 12;
    const monthlyPayment = remainingAmount / months;

    return (
        <Card className="mt-8 border-primary/20 shadow-sm">
            <CardHeader className="bg-primary/5 pb-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <Calculator className="h-5 w-5" />
                    حاسبة التمويل العقاري
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* المقدم */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label>المقدم (D.P)</Label>
                            <span className="text-sm font-bold text-primary">{downPaymentPercent}%</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="80"
                            step="5"
                            value={downPaymentPercent}
                            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <p className="text-xs text-muted-foreground text-left" dir="ltr">
                            {downPaymentAmount.toLocaleString("ar-EG")} ج.م
                        </p>
                    </div>

                    {/* عدد السنين */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label>مدة التقسيط</Label>
                            <span className="text-sm font-bold text-primary">{years} سنوات</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="15"
                            step="1"
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <p className="text-xs text-muted-foreground text-left" dir="ltr">
                            {months} شهر
                        </p>
                    </div>
                </div>

                {/* النتيجة */}
                <div className="bg-primary/10 p-4 rounded-xl flex items-center justify-between mt-4">
                    <span className="font-medium">القسط الشهري المتوقع:</span>
                    <div className="text-left">
            <span className="text-2xl font-bold text-primary">
              {Math.round(monthlyPayment).toLocaleString("ar-EG")}
            </span>
                        <span className="text-sm text-primary/80"> ج.م / شهرياً</span>
                    </div>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                    * هذه الحاسبة تقريبية وقد تختلف الأقساط بناءً على شروط المطور أو البنك.
                </p>
            </CardContent>
        </Card>
    );
}