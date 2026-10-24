/**
 * Mock Commodity & Trade Positions Data
 * Provides instant initial render without waiting for cold database connections.
 * Real database data revalidates in the background as users scroll or interact.
 */

export const MOCK_PRODUCTS = [
  {
    _id: 'mock-comm-01',
    name: 'Grade 1 Robusta Coffee Beans',
    category: 'Beverages',
    price: 3450,
    unit: 'MT',
    quantity: 1200,
    moq: 20,
    origin: 'Dak Lak, Vietnam',
    portOfOrigin: 'VNHPH (Haiphong Port)',
    incoterm: 'FOB',
    currency: 'USD',
    hsCode: '0901.11',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
    description: 'Screen 18 clean polished export grade robusta. Moisture max 12.5%, black & broken max 0.5%, foreign matter max 0.1%. Inspected and certified by SGS Haiphong.',
    verificationStatus: 'verified',
    verificationBadge: 'SGS Lab Inspected',
    exporterEmail: 'vietnam.coffee.exports@trade.vn',
    certificates: [
      { name: 'SGS Moisture & Defect Certificate', issuer: 'SGS Vietnam', url: '#' },
      { name: 'Phytosanitary Clearance', issuer: 'Vietnam Plant Protection Dept', url: '#' }
    ]
  },
  {
    _id: 'mock-comm-02',
    name: 'Non-GMO Feed Grade Soybeans',
    category: 'Agriculture',
    price: 520,
    unit: 'MT',
    quantity: 4500,
    moq: 100,
    origin: 'Mato Grosso, Brazil',
    portOfOrigin: 'BRSSZ (Port of Santos)',
    incoterm: 'FOB',
    currency: 'USD',
    hsCode: '1201.90',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=1200&auto=format&fit=crop',
    description: 'Bulk yellow soybeans for commercial feed processing. Protein content min 34%, oil min 18.5%, moisture max 13.5%. Clean bill of lading issued upon port load.',
    verificationStatus: 'verified',
    verificationBadge: 'Bureau Veritas Audited',
    exporterEmail: 'agro.santos.export@brasiltrade.com',
    certificates: [
      { name: 'Bureau Veritas Grade Certificate', issuer: 'Bureau Veritas', url: '#' }
    ]
  },
  {
    _id: 'mock-comm-03',
    name: 'Pure Ceylon Cinnamon (Grade ALBA)',
    category: 'Spices',
    price: 48500,
    unit: 'MT',
    quantity: 85,
    moq: 2,
    origin: 'Matara, Sri Lanka',
    portOfOrigin: 'LKCMB (Port of Colombo)',
    incoterm: 'CIF',
    currency: 'USD',
    hsCode: '0906.11',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1599422315843-ea78a4870502?q=80&w=1200&auto=format&fit=crop',
    description: 'True Ceylon Alba quills, pencil-thin diameter (<6mm). Zero coumarin contamination, sweet aroma, harvested from ancient southern estates.',
    verificationStatus: 'verified',
    verificationBadge: 'SGS Lab Inspected',
    exporterEmail: 'ceylon.spices@colombotrade.lk',
    certificates: [
      { name: 'Certificate of Origin Form A', issuer: 'Department of Commerce LK', url: '#' }
    ]
  },
  {
    _id: 'mock-comm-04',
    name: 'Jasmine Fragrant White Rice (AAA 100%)',
    category: 'Food',
    price: 880,
    unit: 'MT',
    quantity: 2800,
    moq: 25,
    origin: 'Mekong Delta, Vietnam',
    portOfOrigin: 'VNSGN (Saigon Port)',
    incoterm: 'FOB',
    currency: 'USD',
    hsCode: '1006.30',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200&auto=format&fit=crop',
    description: 'Long grain 100% broken-free jasmine rice. Purity 95% min, chalky kernels max 2.0%, moisture max 14.0%. Packaged in 50kg export grade PP bags.',
    verificationStatus: 'verified',
    verificationBadge: 'Vinacontrol Certified',
    exporterEmail: 'mekong.delta.grains@saigonexp.com',
    certificates: [
      { name: 'Vinacontrol Export Quality Certificate', issuer: 'Vinacontrol', url: '#' }
    ]
  },
  {
    _id: 'mock-comm-05',
    name: 'Grade RSS3 Natural Rubber Ribbed Smoked Sheets',
    category: 'Industrial Materials',
    price: 2150,
    unit: 'MT',
    quantity: 650,
    moq: 15,
    origin: 'Surat Thani, Thailand',
    portOfOrigin: 'THBKK (Bangkok Terminal)',
    incoterm: 'FOB',
    currency: 'USD',
    hsCode: '4001.22',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=1200&auto=format&fit=crop',
    description: 'Dry natural rubber sheets, free of mold, blemishes, and bark particles. Conforms to Green Book International Standards for TSR/RSS.',
    verificationStatus: 'verified',
    verificationBadge: 'SGS Lab Inspected',
    exporterEmail: 'siam.rubber.corp@thaiexport.th',
    certificates: [
      { name: 'TSR Green Book Conformance Report', issuer: 'Rubber Authority Thailand', url: '#' }
    ]
  },
  {
    _id: 'mock-comm-06',
    name: 'Electrolytic Copper Cathodes (Grade A 99.99%)',
    category: 'Metals',
    price: 9450,
    unit: 'MT',
    quantity: 320,
    moq: 20,
    origin: 'Antofagasta, Chile',
    portOfOrigin: 'CLANF (Port of Antofagasta)',
    incoterm: 'CIF',
    currency: 'USD',
    hsCode: '7403.11',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?q=80&w=1200&auto=format&fit=crop',
    description: 'LME registered Grade A copper cathodes 99.9935% purity. Standard dimensions 914mm x 914mm x 12mm, bundled with steel straps.',
    verificationStatus: 'verified',
    verificationBadge: 'Alex Stewart Assayed',
    exporterEmail: 'chilean.metals@antofatrade.cl',
    certificates: [
      { name: 'Assay Certificate of Purity', issuer: 'Alex Stewart International', url: '#' }
    ]
  },
  {
    _id: 'mock-comm-07',
    name: 'Kashmir Mogra Saffron (Grade A1)',
    category: 'Spices',
    price: 3200,
    unit: 'kg',
    quantity: 45,
    moq: 1,
    origin: 'Pampore, Kashmir, India',
    portOfOrigin: 'INBOM (Jawaharlal Nehru Port)',
    incoterm: 'CIF',
    currency: 'USD',
    hsCode: '0910.20',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821eec9bd1?q=80&w=1200&auto=format&fit=crop',
    description: 'Hand-picked stigma threads of Crocus sativus from the saffron terraces of Pampore. Crocin color strength > 240, moisture < 8%.',
    verificationStatus: 'verified',
    verificationBadge: 'Spices Board of India Verified',
    exporterEmail: 'kashmir.saffron.traders@jntrade.in',
    certificates: [
      { name: 'GI Tag Certification', issuer: 'Government of J&K', url: '#' }
    ]
  },
  {
    _id: 'mock-comm-08',
    name: 'Organic Virgin Coconut Oil (Cold Pressed)',
    category: 'Food',
    price: 3100,
    unit: 'MT',
    quantity: 420,
    moq: 10,
    origin: 'Davao, Philippines',
    portOfOrigin: 'PHDVO (Port of Davao)',
    incoterm: 'FOB',
    currency: 'USD',
    hsCode: '1513.11',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbadcbaf?q=80&w=1200&auto=format&fit=crop',
    description: 'Unrefined, non-bleached extra virgin coconut oil extracted via wet centrifuge. Free fatty acids < 0.1%, moisture < 0.1%, Lauric acid > 50%.',
    verificationStatus: 'verified',
    verificationBadge: 'ECOCERT Organic Verified',
    exporterEmail: 'pacific.coco.export@davaotrade.ph',
    certificates: [
      { name: 'ECOCERT Organic Certificate', issuer: 'ECOCERT', url: '#' }
    ]
  }
];

export const getMockProductById = (id) => {
  return MOCK_PRODUCTS.find((p) => String(p._id) === String(id) || String(p.id) === String(id));
};
