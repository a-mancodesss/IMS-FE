export const TABLE_CONFIG = {
  room: {
    header: {
      title: "All Rooms",
      subtitle: "View and manage rooms across different floors",
    },

    filterOptions: {
      visible: true,
      dropdown: { show: true, value: "All floors", endPointKey: "floor" },
      advancedFilter: { show: false },
      searchBar: { show: true, value: "Search rooms by name" },
    },

    columnHeaders: [
      { label: "Room", additionalStyles: "justify-start w-[25rem]" },
      { label: "Type", additionalStyles: "justify-start w-40" },
      { label: "Floor", additionalStyles: "justify-start w-24" },
      { label: "Total Items", additionalStyles: "justify-center w-24" },
      { label: "View", additionalStyles: "justify-center w-24" },
    ],

    responseMapping: {
      countKey: "totalRooms",
      dataKey: "rooms",
      idKey: "_id",
      dataFields: [
        {
          key: "roomName",
          label: "Room",
          additionalStyles: "text-left w-[25rem]",
          additionalDetail: "allottedTo",
        },
        {
          key: "roomTypeName",
          label: "Type",
          additionalStyles: "text-left w-40",
        },
        {
          key: "roomFloorName",
          label: "Floor",
          additionalStyles: "text-left w-24",
        },
        {
          key: "totalItems",
          label: "Total Items",
          additionalStyles: "text-center w-24",
        },
      ],
    },
    rowActions: {
      visible: true,
      view: { show: true, path: "/rooms/room/" },
      edit: false,
      delete: false,
    },

    noData: "room",
  },

  item: {
    header: {
      title: "All Items",
      subtitle: "View and manage all inventory items across the department",
    },

    filterOptions: {
      visible: true,
      dropdown: { show: false },
      advancedFilter: { show: true },
      searchBar: { show: true, value: "Search items by name or id" },
    },

    columnHeaders: [
      {
        label: "Name & Category",
        additionalStyles: "justify-start w-48",
      },
      { label: "Item ID", additionalStyles: "justify-start w-28" },
      { label: "Make/Model No.", additionalStyles: "justify-start w-48" },
      { label: "Location", additionalStyles: "justify-start w-[17.5rem]" },
      { label: "Status", additionalStyles: "justify-center w-[5.75rem]" },
      { label: "View", additionalStyles: "justify-center w-24" },
    ],

    responseMapping: {
      countKey: "totalItems",
      dataKey: "items",
      idKey: "_id",
      dataFields: [
        {
          key: "itemName",
          label: "Name",
          additionalStyles: "text-left w-48",
          additionalDetail: "itemCategory",
        },
        {
          key: "itemSerialNumber",
          label: "Item ID",
          additionalStyles: "text-left w-28",
        },
        {
          key: "itemModelNumberOrMake",
          label: "Make/Model No.",
          additionalStyles: "text-left w-48",
        },
        {
          key: "itemRoom",
          label: "Location",
          additionalStyles: "text-left w-[17.5rem]",
          additionalDetail: "itemFloor",
        },
        {
          key: "itemStatus",
          label: "Status",
          additionalStyles: "text-center w-[5.75rem] font-semibold",
        },
      ],
    },
    rowActions: {
      visible: true,
      view: { show: true, path: "/inventory/item/" },
      edit: false,
      delete: false,
    },
    noData: "item",
  },

  activity: {
    header: {
      title: "Recent Activities",
      subtitle: "View recent activities across the system",
    },

    filterOptions: {
      visible: true,
      dropdown: { show: false },
      advancedFilter: { show: false },
      searchBar: { show: false },
    },

    columnHeaders: [
      {
        label: "Date",
        additionalStyles: "justify-start w-24",
      },
      { label: "Time", additionalStyles: "justify-start w-24" },
      { label: "User", additionalStyles: "justify-start w-40" },
      { label: "Action", additionalStyles: "justify-start w-[27rem]" },
    ],

    responseMapping: {
      countKey: "totalLogs",
      dataKey: "logs",
      idKey: "_id",
      dataFields: [
        { key: "createdAt", label: "Date", additionalStyles: "text-left w-24" },
        { key: "createdAt", label: "Time", additionalStyles: "text-left w-24" },
        {
          key: "performedByName",
          label: "User",
          additionalStyles: "text-left w-40",
        },
        {
          key: "description",
          label: "Action",
          additionalStyles: "text-left w-[27rem]",
        },
      ],
    },
    rowActions: {
      visible: false,
      view: { show: false },
      edit: false,
      delete: false,
    },
    noData: "activity",
  },

  category: {
    header: {
      title: "All Categories",
      subtitle: "View and manage categories for different items",
    },

    filterOptions: {
      visible: false,
      dropdown: { show: false },
      advancedFilter: { show: false },
      searchBar: { show: false },
    },

    columnHeaders: [
      {
        label: "Name",
        additionalStyles: "justify-start w-60",
      },
      { label: "Total Items", additionalStyles: "justify-center w-24" },
      { label: "Action", additionalStyles: "justify-center w-24" },
    ],

    responseMapping: {
      countKey: "totalCategories",
      dataKey: "categories",
      idKey: "_id",
      dataFields: [
        {
          key: "categoryName",
          label: "Name",
          additionalStyles: "text-left w-60",
        },
        {
          key: "totalItems",
          label: "Total Items",
          additionalStyles: "text-center w-24",
        },
      ],
    },
    rowActions: {
      visible: true,
      view: { show: true, path: "/categories/category/" },
      edit: false,
      delete: true,
    },
    noData: "category",
  },

  user: {
    header: {
      title: "All Users",
      subtitle: "View and manage users across the system",
    },

    filterOptions: {
      visible: true,
      dropdown: { show: false },
      advancedFilter: { show: false },
      searchBar: { show: true, value: "Search user by name" },
    },

    columnHeaders: [
      {
        label: "Name",
        additionalStyles: "justify-start w-40",
      },
      { label: "Email", additionalStyles: "justify-start w-60" },
      { label: "Phone Number", additionalStyles: "justify-start w-32" },
      { label: "Role", additionalStyles: "justify-center w-24" },
      // { label: "Action", additionalStyles: "justify-center w-24" },
    ],

    responseMapping: {
      countKey: "totalUsers",
      dataKey: "users",
      idKey: "_id",
      dataFields: [
        {
          key: "username",
          label: "Name",
          additionalStyles: "text-left w-40",
        },
        {
          key: "email",
          label: "Email",
          additionalStyles: "text-start w-60",
        },
        {
          key: "phone_number",
          label: "Phone Number",
          additionalStyles: "text-start w-32",
        },
        {
          key: "role",
          label: "Role",
          additionalStyles: "text-center w-24 font-semibold",
        },
      ],
    },
    rowActions: {
      visible: false,
      view: { show: false },
      edit: false,
      delete: false,
    },
    noData: "user",
  },
};

export const INVENTORY_STATS_RESPONSE_MAPPING = {
  responseMapping: {
    totalItems: "no_total_items",
    workingItems: "no_working",
    repairableItems: "no_repairable",
    notWorkingItems: "no_not_working",
    totalInventoryValue: "inventory_total_value",
    totalItemsTillLastMonth: "no_total_items_till_last_month",
  },
};

export const PIE_CHART_RESPONSE_MAPPING = {
  status: {
    workingItems: "no_category_working_items",
    repairableItems: "no_category_repairable_items",
    notWorkingItems: "no_category_not_working_items",
  },

  source: {
    purchaseItems: "no_category_purchase_items",
    donationItems: "no_category_donated_items",
  },
};

export const DROPDOWN_RESPONSE_MAPPING = {
  floor: {
    idKey: "_id",
    dataKey: "floorName",
  },
  roomType: {
    idKey: "_id",
    dataKey: "roomTypeName",
  },
  room: {
    idKey: "_id",
    dataKey: "roomName",
  },
  category: {
    idKey: "_id",
    dataKey: "categoryName",
  },
  subCategory: {
    idKey: "_id",
    dataKey: "subCategoryName",
  },
  item: {
    idKey: "sourceId",
    dataKey: "sourceName",
  },
  status: {
    idKey: "statusId",
    dataKey: "statusName",
  },
};
