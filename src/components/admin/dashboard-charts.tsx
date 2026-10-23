"use client";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ألوان الهوية (الأزرق الملكي والذهبي) عشان تليق بالبراند
const COLORS = ['#0B1F3A', '#C8A15A'];

export function DashboardCharts({
                                    purposeData,
                                    typeData
                                }: {
    purposeData: { name: string; value: number }[];
    typeData: { name: string; value: number }[];
}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* رسم بياني دائري للغرض (بيع/إيجار) */}
            <Card className="bg-card shadow-sm border-border">
                <CardHeader>
                    <CardTitle className="text-lg">توزيع العقارات حسب الغرض</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={purposeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70} // الفراغ من جوه عشان يبقى Donut
                                outerRadius={100}
                                paddingAngle={8} // مسافة بين الأجزاء عشان تبان شيك
                                dataKey="value"
                                stroke="none" // شيلنا الحدود السودا
                            >
                                {purposeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '12px',
                                    color: 'hsl(var(--foreground))',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle" // شكل الدواير تحت
                                wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* رسم بياني عمودي لأنواع العقارات */}
            <Card className="bg-card shadow-sm border-border">
                <CardHeader>
                    <CardTitle className="text-lg">توزيع العقارات حسب النوع</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={typeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            {/* شيلنا الخطوط الرأسية عشان ننضف الشكل */}
                            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" vertical={false} />

                            <XAxis
                                dataKey="name"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10} // نزلنا الكلام شوية تحت
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dx={-10}
                            />

                            <RechartsTooltip
                                cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '12px',
                                    color: 'hsl(var(--foreground))',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />

                            {/* ضفنا radius عشان الأعمدة تبقى مدورة من فوق */}
                            <Bar
                                dataKey="value"
                                fill="hsl(var(--primary))"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={60} // مش عايزين الأعمدة تبقى تخينة أوي
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    );
}