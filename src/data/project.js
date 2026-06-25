// ============================================================================
// NGUỒN DỮ LIỆU DUY NHẤT của landing page HIỆP PHƯỚC PREMIA
// Sửa nội dung tại đây — toàn bộ trang render từ object này.
//
// ⚠️ CÁC TRƯỜNG CẦN XÁC NHẬN TRƯỚC KHI ĐĂNG (đánh dấu "// XÁC NHẬN"):
//   - Giá & chính sách thanh toán (tham khảo thị trường T06/2026)
//   - Diện tích tổng (tài liệu CĐT: 80ha)
//   - Hỗ trợ lãi suất 0%
// Ảnh: thay link trong các trường *Image / src bằng ảnh thật của bộ tài liệu.
// ============================================================================

export const project = {
  theme: {
    brand: '#0f3d2e',
    brandLight: '#1b5e44',
    gold: '#c9a86a',
    goldDark: '#a9883f',
    nav: '#0f3d2e',
  },

  logo: '/images/logo',
  name: 'HIỆP PHƯỚC PREMIA',
  shortDescription:
    'ĐÔ THỊ SINH THÁI VEN SÔNG NAM SÀI GÒN – SỔ ĐỎ TỪNG NỀN, BÊN 1KM BỜ SÔNG SOÀI RẠP',

  badges: [
    { label: 'ƯU ĐÃI', value: 'Giá chỉ từ 1,79 tỷ/nền' }, // XÁC NHẬN giá
    { label: 'THANH TOÁN', value: 'Giãn đến 30 tháng' }, // XÁC NHẬN chính sách
    { label: 'HỖ TRỢ LÃI SUẤT', value: '0% trong 30 tháng' }, // XÁC NHẬN chính sách
  ],

  heroImage:
    'https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&w=2000&q=80',

  longDescription: [
    'Hiệp Phước Premia là đô thị sinh thái ven sông quy mô 80ha do Hải Thành – đơn vị hơn 40 năm kinh nghiệm – phát triển và DKRA Realty phân phối, tọa lạc bên hơn 1km bờ sông Soài Rạp, ngay trục Nguyễn Văn Tạo nối dài, cửa ngõ Nam Sài Gòn. Tiên phong kiến tạo chuẩn sống mới "River Harmony Living", dự án sở hữu lợi thế "kề giang cận lộ" hiếm có cùng pháp lý hoàn thiện – sổ đỏ riêng từng nền, sở hữu lâu dài.',
    'Với 2.496 sản phẩm nhà phố – biệt thự, hơn 40 tiện ích nội khu và vị trí đón đầu loạt hạ tầng tỷ đô khu Nam (Vành đai 3 – 4, cao tốc Bến Lức – Long Thành, Metro, cảng biển), Hiệp Phước Premia là điểm đến cho cả nhu cầu an cư lẫn đầu tư đón sóng tăng giá.',
  ],

  infoTitle: 'THÔNG TIN TỔNG QUAN DỰ ÁN HIỆP PHƯỚC PREMIA',
  info: [
    { label: 'Tên thương mại', value: 'HIỆP PHƯỚC PREMIA' },
    {
      label: 'Vị trí',
      value:
        'Xã Tân Tập, tỉnh Tây Ninh (trước là xã Phước Vĩnh Đông, huyện Cần Giuộc, tỉnh Long An cũ)',
    },
    { label: 'Đơn vị phát triển', value: 'Hải Thành (Hai Thanh Group)' },
    { label: 'Tổng đại lý tiếp thị & phân phối', value: 'DKRA Realty' },
    { label: 'Tổng diện tích', value: '80 ha' }, // XÁC NHẬN diện tích
    { label: 'Mật độ xây dựng', value: '42,59%' },
    { label: 'Mật độ cảnh quan & tiện ích', value: '20,44%' },
    {
      label: 'Cơ cấu sản phẩm',
      value:
        '2.496 sản phẩm – 2.101 nhà phố liền kề (3 tầng), 317 nhà phố liền kề (4 tầng), 78 biệt thự',
    },
    {
      label: 'Pháp lý',
      value:
        'Sổ đỏ riêng từng nền · QH 1/500 · QĐ chủ trương đầu tư · Giấy phép xây dựng · Sở hữu lâu dài',
    },
  ],

  highlights: [
    { label: 'Quy mô dự án', value: '80 ha' },
    { label: 'Số sản phẩm', value: '2.496' },
    { label: 'Tiện ích nội khu', value: '40+' },
    { label: 'Bờ sông Soài Rạp', value: '1 km' },
  ],

  cta: {
    title: 'NHẬN NGAY BẢNG GIÁ & GIỎ HÀNG HIỆP PHƯỚC PREMIA',
    subtitle:
      'Đăng ký để nhận bảng giá, mặt bằng phân khu và chính sách thanh toán ưu đãi tháng này',
    hotline: '0888.40.32.32',
    note: '* Thông tin của quý khách được bảo mật tuyệt đối',
  },

  location: {
    title: 'VỊ TRÍ HIỆP PHƯỚC PREMIA – TÂM ĐIỂM TĂNG TRƯỞNG NAM SÀI GÒN',
    paragraphs: [
      'Hiệp Phước Premia tọa lạc tại trục Nguyễn Văn Tạo nối dài, bên hơn 1km bờ sông Soài Rạp – vị trí "kề giang cận lộ" hội tụ các động lực phát triển Logistics – Đô thị – Cảng biển – Sân bay – Metro của Nam Sài Gòn.',
      'Từ dự án: 5 phút kết nối cao tốc Bến Lức – Long Thành; ~20 phút tới Phú Mỹ Hưng và Sân bay Quốc tế Long Thành; ~25 phút về trung tâm TP.HCM qua Depot Metro Hiệp Phước (ga Metro Bến Thành). Liền kề Cảng Quốc tế Long An, KCN Phước Vĩnh Đông, KCN Long Hậu.',
    ],
    image:
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80',
  },

  differences: {
    title: 'BA ĐIỂM KHÁC BIỆT CỦA HIỆP PHƯỚC PREMIA',
    items: [
      {
        title: 'VỊ THẾ SONG THỦY & SONG LỘ',
        description:
          'Hiếm có sản phẩm vừa ôm trọn hơn 1km bờ sông Soài Rạp, vừa nằm trên trục giao thông huyết mạch Nguyễn Văn Tạo – mở ra giá trị an cư trong lành và tiềm năng tăng giá theo hạ tầng.',
      },
      {
        title: 'LIỀN KỀ DEPOT METRO HIỆP PHƯỚC',
        description:
          'Kết nối thuận tiện tới ga Metro Bến Thành, rút ngắn thời gian về trung tâm TP.HCM chỉ ~25 phút – lợi thế kết nối hiếm dự án vùng ven nào có được.',
      },
      {
        title: 'PHÁP LÝ HOÀN THIỆN – SỔ ĐỎ TỪNG NỀN',
        description:
          'Sổ đỏ riêng từng nền, sở hữu lâu dài, nhận nền xây dựng ngay – đảm bảo an toàn và giá trị bền vững cho cả người mua ở lẫn nhà đầu tư.',
      },
    ],
  },

  amenities: {
    title: 'HƠN 40 TIỆN ÍCH NỘI KHU HIỆP PHƯỚC PREMIA',
    paragraphs: [
      'Hiệp Phước Premia kiến tạo hệ sinh thái tiện ích hoàn chỉnh chia theo 4 phân khu chủ đề: Kona Camp (tổ hợp cắm trại – BBQ – clubhouse), Aloha Bay (sân khấu Aloha, hồ cát thư giãn, cầu tình yêu), Mana Bay (hồ bơi vô cực, sông lười, hồ tạo sóng, khu trò chơi nước) và Active Hub (sân pickleball, sân bóng đá, bóng rổ, phòng Gym & Yoga).',
      'Bên cạnh đó là chuỗi tiện ích sống đầy đủ: Trung tâm thương mại The Premia Mall, hệ thống trường mầm non – tiểu học – THCS Hiệp Phước, Trung tâm y tế Health Center, khu thiền định Zen Retreat, quảng trường và khu đua xe Go Kart – đáp ứng trọn vẹn nhu cầu sống, học tập, giải trí ngay trong nội khu.',
    ],
    images: [
      {
        src: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
        caption: 'Hồ bơi vô cực – phân khu Mana Bay',
      },
      {
        src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
        caption: 'Tổ hợp cắm trại – BBQ Kona Camp',
      },
      {
        src: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
        caption: 'Cụm sân thể thao – Active Hub',
      },
      {
        src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Mặt bằng tổng thể tiện ích nội khu',
      },
    ],
  },

  floorPlan: {
    title: 'MẶT BẰNG TỔNG THỂ HIỆP PHƯỚC PREMIA',
    paragraphs: [
      'Toàn khu 80ha được quy hoạch bài bản với mật độ xây dựng 42,59% và hơn 20% dành cho cảnh quan – tiện ích, gồm 2.496 sản phẩm nhà phố liền kề và biệt thự.',
      'Hệ thống đường nội khu rộng rãi, phân khu chức năng rõ ràng, các dãy nhà hướng ra công viên – mặt nước, tối ưu ánh sáng và sự riêng tư.',
    ],
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
  },

  design: {
    title: 'SẢN PHẨM NHÀ PHỐ – BIỆT THỰ HIỆP PHƯỚC PREMIA',
    paragraphs: [
      'Dự án cung cấp đa dạng dòng sản phẩm: nhà phố liền kề 3 tầng và 4 tầng, biệt thự ven sông – phù hợp nhiều nhu cầu ở và đầu tư.',
      'Thiết kế hiện đại, tối ưu công năng, nhiều căn hướng sông và công viên nội khu, nhận nền xây dựng ngay theo nhu cầu.',
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
  },

  pricing: {
    title: 'GIÁ BÁN HIỆP PHƯỚC PREMIA',
    note: '* Giá & chính sách thanh toán tham khảo thị trường T06/2026 – vui lòng liên hệ để nhận giỏ hàng & chính sách chính thức.',
    units: [
      {
        type: 'Nhà phố liền kề 3 tầng',
        area: '80 – 190 m²',
        price: 'Từ 1,79 tỷ/nền', // XÁC NHẬN
        payment: 'Giãn 30 tháng', // XÁC NHẬN
      },
      {
        type: 'Nhà phố / Shophouse 4 tầng',
        area: '80 – 140 m²',
        price: 'Liên hệ', // CẦN ĐIỀN giá
        payment: 'Giãn 30 tháng', // XÁC NHẬN
      },
      {
        type: 'Biệt thự ven sông',
        area: '165 – 244 m²',
        price: 'Liên hệ', // CẦN ĐIỀN giá
        payment: 'Liên hệ', // CẦN ĐIỀN chính sách
      },
    ],
  },

  reasons: {
    title: 'LÝ DO NÊN ĐẦU TƯ HIỆP PHƯỚC PREMIA NGAY',
    items: [
      {
        title: 'VỊ TRÍ "VÀNG" KỀ GIANG CẬN LỘ',
        description:
          'Bên 1km bờ sông Soài Rạp và trục Nguyễn Văn Tạo, kết nối đa điểm và đón đầu hạ tầng – trở thành tâm điểm tăng trưởng mới khu Nam TP.HCM.',
      },
      {
        title: 'PHÁP LÝ HOÀN THIỆN, SỔ ĐỎ LÂU DÀI',
        description:
          'Sổ đỏ riêng từng nền, nhận nền xây ngay; sản phẩm đất nền ven sông khan hiếm, đảm bảo giá trị an cư và đầu tư bền vững.',
      },
      {
        title: 'CHỦ ĐẦU TƯ UY TÍN + TIỀM NĂNG TĂNG GIÁ',
        description:
          'Hải Thành hơn 40 năm kinh nghiệm, pháp lý minh bạch; nguồn cung nổi đô khan hiếm cùng làn sóng dịch chuyển ra khu Nam mở dư địa tăng giá mạnh.',
      },
    ],
  },

  buyers: {
    title: 'AI NÊN SỞ HỮU HIỆP PHƯỚC PREMIA?',
    items: [
      {
        title: 'Nhà đầu tư đón sóng hạ tầng',
        description:
          'Vốn ban đầu hợp lý, đón đầu Vành đai 3–4, cao tốc, Metro, cảng biển khu Nam – biên độ tăng giá lớn.',
      },
      {
        title: 'Gia đình muốn an cư ven sông',
        description:
          'Tìm không gian sống sinh thái, sổ đỏ rõ ràng, tiện ích nội khu đầy đủ cho cả gia đình.',
      },
      {
        title: 'Người mua tích sản',
        description:
          'Có dòng tiền nhàn rỗi, muốn giữ tài sản đất nền pháp lý sạch, vị trí cửa ngõ Nam Sài Gòn dễ thanh khoản.',
      },
    ],
  },

  faq: {
    title: 'CÂU HỎI THƯỜNG GẶP VỀ HIỆP PHƯỚC PREMIA',
    items: [
      {
        question: 'Hiệp Phước Premia ở đâu?',
        answer:
          'Tại trục Nguyễn Văn Tạo nối dài, xã Tân Tập (trước là Phước Vĩnh Đông, Cần Giuộc, Long An cũ), bên bờ sông Soài Rạp – cửa ngõ Nam TP.HCM.',
      },
      {
        question: 'Pháp lý dự án thế nào?',
        answer:
          'Sổ đỏ riêng từng nền, sở hữu lâu dài, đã có QH 1/500, quyết định đầu tư và giấy phép xây dựng.',
      },
      {
        question: 'Giá bán bao nhiêu, thanh toán ra sao?',
        answer:
          'Giá chỉ từ 1,79 tỷ/nền, chính sách thanh toán giãn đến 30 tháng (xác nhận chính sách mới nhất khi liên hệ).',
      },
      {
        question: 'Chủ đầu tư là ai?',
        answer:
          'Hải Thành (Hai Thanh Group) – hơn 40 năm kinh nghiệm, DKRA Realty là tổng đại lý phân phối.',
      },
    ],
  },

  consultant: {
    title: 'AI SẼ LÀ NGƯỜI TƯ VẤN CHO QUÝ KHÁCH?',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
    name: 'Hoàng Phi Long',
    role: 'Founder & CEO – 102 Creative',
    phone: '0888.40.32.32',
    description: [
      'Ông Hoàng Phi Long là nhà sáng lập và điều hành 102 Creative, với hơn 10 năm kinh nghiệm thực chiến trong bất động sản và marketing, đồng hành cùng khách hàng từ chiến lược đến giao dịch thật.',
      'Với Hiệp Phước Premia, đội ngũ 102 Creative sẽ tư vấn chọn vị trí nền đẹp, phân tích tiềm năng đầu tư và chính sách phù hợp nhất cho từng nhu cầu. Liên hệ ngay để được hỗ trợ:',
    ],
  },

  zalo: 'https://zalo.me/0888403232',

  footer: {
    company: '102 Creative – Agency Marketing Bất động sản',
    address: 'www.102creative.vn',
    hotline: '0888.40.32.32',
    email: 'Lhi.networking2025@gmail.com',
    copyright: '© 2026 102 Creative. Thông tin chỉ mang tính tham khảo.',
  },
}
