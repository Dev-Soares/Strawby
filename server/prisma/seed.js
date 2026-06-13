"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
const PATIENT_EMAIL = 'usuario@teste.com';
const NUTRITIONIST_EMAIL = 'nutricionista@teste.com';
const PASSWORD = 'Teste123!';
const SALT_ROUNDS = 10;
function utcDay(daysAgo) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - daysAgo);
    d.setUTCHours(12, 0, 0, 0);
    return d;
}
function dateOnly(daysAgo) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - daysAgo);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}
async function main() {
    console.log('🌱 Iniciando seed...');
    const hash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
    const existingPatientUser = await prisma.user.findUnique({ where: { email: PATIENT_EMAIL } });
    const existingNutriUser = await prisma.user.findUnique({ where: { email: NUTRITIONIST_EMAIL } });
    if (existingPatientUser)
        await prisma.user.delete({ where: { email: PATIENT_EMAIL } });
    if (existingNutriUser)
        await prisma.user.delete({ where: { email: NUTRITIONIST_EMAIL } });
    const nutriUser = await prisma.user.create({
        data: {
            name: 'Dra. Ana Lima',
            email: NUTRITIONIST_EMAIL,
            password: hash,
            emailVerified: true,
            role: 'nutritionist',
            termsAcceptedAt: new Date(),
            termsVersion: '1.0',
            nutritionist: {
                create: {
                    code: 'ANALIMA',
                },
            },
        },
        include: { nutritionist: true },
    });
    console.log('✅ Nutricionista criada:', nutriUser.email);
    const patientUser = await prisma.user.create({
        data: {
            name: 'Carlos Oliveira',
            email: PATIENT_EMAIL,
            password: hash,
            emailVerified: true,
            role: 'patient',
            termsAcceptedAt: new Date(),
            termsVersion: '1.0',
            patient: {
                create: {
                    nutritionistId: nutriUser.nutritionist.id,
                    weight: 82,
                    height: 178,
                    age: 28,
                    gender: 'male',
                    currentStreak: 5,
                    bestStreak: 12,
                },
            },
        },
        include: { patient: true },
    });
    console.log('✅ Paciente criado:', patientUser.email);
    const patientId = patientUser.patient.id;
    await prisma.plan.create({
        data: {
            patientId,
            calories: 2400,
            protein: 180,
            carbs: 260,
            fat: 70,
        },
    });
    console.log('✅ Plano alimentar criado: 2400 kcal');
    const foods = await Promise.all([
        prisma.privateFood.create({ data: { patientId, name: 'Frango grelhado', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Arroz branco cozido', calories: 128, protein: 2.6, carbs: 28, fat: 0.3, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Feijão carioca cozido', calories: 77, protein: 4.8, carbs: 14, fat: 0.5, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Ovo inteiro', calories: 143, protein: 13, carbs: 0, fat: 9.5, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Pão integral', calories: 247, protein: 9, carbs: 46, fat: 3.5, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Banana prata', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Leite desnatado', calories: 35, protein: 3.4, carbs: 5, fat: 0.1, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Batata doce cozida', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Aveia em flocos', calories: 389, protein: 17, carbs: 66, fat: 7, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Whey protein', calories: 390, protein: 78, carbs: 8, fat: 7, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Azeite de oliva', calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Iogurte grego natural', calories: 130, protein: 10, carbs: 10, fat: 5, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Maçã fuji', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Salmão grelhado', calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Batata inglesa cozida', calories: 77, protein: 2, carbs: 17, fat: 0.1, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Requeijão light', calories: 159, protein: 9, carbs: 3, fat: 12, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Cenoura crua', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, servingSize: '100' } }),
        prisma.privateFood.create({ data: { patientId, name: 'Brócolis cozido', calories: 35, protein: 2.4, carbs: 7, fat: 0.4, servingSize: '100' } }),
    ]);
    const [frango, arroz, feijao, ovo, pao, banana, leite, batataDoce, aveia, whey, azeite, iogurte, maca, salmao, batata, requeijao, cenoura, brocolis] = foods;
    console.log('✅ Alimentos privados criados:', foods.length);
    function item(food, quantity) {
        const ratio = quantity / 100;
        return {
            privateFoodId: food.id,
            quantity,
            calories: food.calories * ratio,
            protein: food.protein * ratio,
            carbs: food.carbs * ratio,
            fat: food.fat * ratio,
        };
    }
    await prisma.meal.create({
        data: {
            patientId, kind: 'PLAN', mealType: 'breakfast', name: 'Café da manhã', time: '07:00',
            date: new Date(),
            items: { create: [item(aveia, 60), item(leite, 200), item(banana, 100), item(whey, 30)] },
        },
    });
    await prisma.meal.create({
        data: {
            patientId, kind: 'PLAN', mealType: 'lunch', name: 'Almoço', time: '12:30',
            date: new Date(),
            items: { create: [item(frango, 200), item(arroz, 150), item(feijao, 100), item(brocolis, 80), item(azeite, 10)] },
        },
    });
    await prisma.meal.create({
        data: {
            patientId, kind: 'PLAN', mealType: 'snack', name: 'Lanche', time: '16:00',
            date: new Date(),
            items: { create: [item(iogurte, 170), item(maca, 150)] },
        },
    });
    await prisma.meal.create({
        data: {
            patientId, kind: 'PLAN', mealType: 'dinner', name: 'Jantar', time: '20:00',
            date: new Date(),
            items: { create: [item(salmao, 180), item(batataDoce, 200), item(cenoura, 80), item(azeite, 8)] },
        },
    });
    console.log('✅ Refeições do plano criadas: 4');
    const dailyTemplates = [
        {
            daysAgo: 0,
            meals: [
                { mealType: 'breakfast', name: 'Café da manhã', time: '07:15', items: [item(aveia, 60), item(leite, 200), item(banana, 100), item(whey, 30)] },
                { mealType: 'lunch', name: 'Almoço', time: '12:30', items: [item(frango, 200), item(arroz, 150), item(feijao, 80), item(brocolis, 80), item(azeite, 10)] },
                { mealType: 'snack', name: 'Lanche', time: '16:00', items: [item(iogurte, 170), item(maca, 130)] },
                { mealType: 'dinner', name: 'Jantar', time: '20:00', items: [item(salmao, 180), item(batataDoce, 200), item(cenoura, 80)] },
            ],
            score: 0.96,
        },
        {
            daysAgo: 1,
            meals: [
                { mealType: 'breakfast', name: 'Café da manhã', time: '07:30', items: [item(ovo, 120), item(pao, 60), item(requeijao, 20), item(banana, 100)] },
                { mealType: 'lunch', name: 'Almoço', time: '13:00', items: [item(frango, 180), item(arroz, 160), item(feijao, 100), item(cenoura, 60), item(azeite, 10)] },
                { mealType: 'snack', name: 'Lanche', time: '15:30', items: [item(maca, 180), item(whey, 30), item(leite, 150)] },
                { mealType: 'dinner', name: 'Jantar', time: '19:45', items: [item(salmao, 150), item(batata, 180), item(brocolis, 100)] },
            ],
            score: 0.88,
        },
        {
            daysAgo: 2,
            meals: [
                { mealType: 'breakfast', name: 'Café da manhã', time: '08:00', items: [item(aveia, 80), item(leite, 250), item(banana, 130)] },
                { mealType: 'lunch', name: 'Almoço', time: '12:45', items: [item(frango, 160), item(arroz, 180), item(feijao, 120), item(azeite, 8)] },
                { mealType: 'snack', name: 'Lanche', time: '16:30', items: [item(iogurte, 200), item(maca, 150)] },
            ],
            score: 0.71,
        },
        {
            daysAgo: 3,
            meals: [
                { mealType: 'breakfast', name: 'Café da manhã', time: '07:00', items: [item(ovo, 150), item(pao, 80), item(requeijao, 30)] },
                { mealType: 'lunch', name: 'Almoço', time: '12:00', items: [item(frango, 220), item(arroz, 140), item(batataDoce, 120), item(brocolis, 100), item(azeite, 12)] },
                { mealType: 'snack', name: 'Lanche', time: '15:45', items: [item(whey, 35), item(leite, 200), item(banana, 100)] },
                { mealType: 'dinner', name: 'Jantar', time: '20:15', items: [item(salmao, 200), item(batataDoce, 180), item(cenoura, 100), item(azeite, 10)] },
            ],
            score: 0.93,
        },
        {
            daysAgo: 4,
            meals: [
                { mealType: 'breakfast', name: 'Café da manhã', time: '09:00', items: [item(pao, 80), item(requeijao, 40)] },
                { mealType: 'lunch', name: 'Almoço', time: '13:30', items: [item(frango, 130), item(arroz, 200), item(feijao, 150)] },
            ],
            score: 0.44,
        },
        {
            daysAgo: 5,
            meals: [
                { mealType: 'breakfast', name: 'Café da manhã', time: '07:10', items: [item(aveia, 60), item(leite, 200), item(banana, 100), item(whey, 30)] },
                { mealType: 'lunch', name: 'Almoço', time: '12:20', items: [item(frango, 200), item(arroz, 150), item(feijao, 100), item(brocolis, 80), item(cenoura, 60), item(azeite, 10)] },
                { mealType: 'snack', name: 'Lanche', time: '15:50', items: [item(iogurte, 170), item(maca, 150)] },
                { mealType: 'dinner', name: 'Jantar', time: '19:30', items: [item(salmao, 180), item(batataDoce, 220), item(brocolis, 80), item(azeite, 8)] },
            ],
            score: 0.98,
        },
        {
            daysAgo: 6,
            meals: [
                { mealType: 'breakfast', name: 'Café da manhã', time: '07:45', items: [item(ovo, 120), item(pao, 60), item(banana, 100), item(leite, 200)] },
                { mealType: 'lunch', name: 'Almoço', time: '12:45', items: [item(frango, 180), item(arroz, 160), item(feijao, 80), item(batata, 100), item(azeite, 10)] },
                { mealType: 'snack', name: 'Lanche', time: '16:15', items: [item(maca, 160), item(whey, 30), item(leite, 150)] },
                { mealType: 'dinner', name: 'Jantar', time: '20:30', items: [item(frango, 160), item(batataDoce, 160), item(cenoura, 80)] },
            ],
            score: 0.85,
        },
    ];
    for (const template of dailyTemplates) {
        const dayDate = utcDay(template.daysAgo);
        for (const mealDef of template.meals) {
            await prisma.meal.create({
                data: {
                    patientId,
                    kind: 'DAILY',
                    mealType: mealDef.mealType,
                    name: mealDef.name,
                    time: mealDef.time,
                    date: dayDate,
                    items: { create: mealDef.items },
                },
            });
        }
        await prisma.dailyScore.upsert({
            where: { patientId_date: { patientId, date: dateOnly(template.daysAgo) } },
            create: { patientId, date: dateOnly(template.daysAgo), score: template.score },
            update: { score: template.score },
        });
    }
    console.log('✅ Refeições diárias criadas: 7 dias');
    console.log('✅ Daily scores criados: 7 dias');
    console.log('');
    console.log('─────────────────────────────────────────');
    console.log('📧 Paciente:      usuario@teste.com');
    console.log('📧 Nutricionista: nutricionista@teste.com');
    console.log('🔑 Senha:         Teste123!');
    console.log('🔗 Código do nutricionista: ANALIMA');
    console.log('─────────────────────────────────────────');
    console.log('🌱 Seed concluído!');
}
main()
    .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map