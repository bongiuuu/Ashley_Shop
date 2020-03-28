// import config from '../../config';
import DataUtils from '../../utils/data.utils';
import { toNumber } from '../../utils/common.utils';

const ORDER_ENUM = ['asc', 'desc', 'ascending', 'descending', '1', '-1', 'ascend', 'descend'];

// const getOrderType = (type) => {
//   if (!ORDER_ENUM.includes(type)) {
//     return config.query_default_order
//   } else {
//     if (type === '1' || type === 'asc' || type === 'ascending' || type === 'ascend') {
//       return 'ASC';
//     } else {
//       return 'DESC';
//     }
//   }
// };

class Page {
  // constructor(req) {
  //   const query = req.query
  //   const pageIndex = query.pageIndex || query.page || query.currentPage; // Start from 1
  //   const pageSize = query.pageSize;
  //   const sorter = query.sorter; // Support sort by multiple fields, e.g: 'sorter=id_desc,vendor.name_ascending'
  //   const sorterArr = sorter && sorter.split(',');

  //   if (sorterArr && sorterArr.length > 0) { // Using sorter parameter
  //     this.order = sorterArr.map(sorter => {
  //       const arr = sorter.split('_');

  //       if (arr.length > 0) {
  //         const orderBy = arr[0];
  //         const orderType = arr[arr.length - 1];
  //         const orderArr = orderBy.split('.');

  //         return [...orderArr, getOrderType(orderType)];
  //       }
  //     });
  //   } else { // Using orderBy & orderType parameters
  //     let orderBy = query.orderBy;
  //     const orderType = query.orderType;

  //     orderBy = orderBy ? orderBy.split('.') : [config.query_default_sort];

  //     this.order = [[...orderBy, getOrderType(orderType)]];
  //   }

  //   if (!DataUtils.isNumber(pageIndex)) {
  //     this.pageIndex = config.query_default_page_index
  //   } else {
  //     this.pageIndex = parseInt(pageIndex, 10)
  //   }

  //   if (!DataUtils.isNumber(pageSize)) {
  //     this.pageSize = config.query_default_page_size
  //   } else {
  //     if (toNumber(pageSize) > config.query_max_page_size) {
  //       this.pageSize = config.query_max_page_size;
  //     } else {
  //       this.pageSize = parseInt(pageSize, 10);
  //     }
  //   }

  //   this.offset = this.pageSize * (this.pageIndex - 1);
  //   this.limit = this.pageSize;
  // }

  getOptions() {
    return {
      limit: this.limit,
      offset: this.offset,
      order: this.order
    }
  }

  setTotal(total) {
    this.totalRecords = total;
    this.totalPages = Math.ceil(total / this.pageSize);
  }

  getPageInfo() {
    return {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      totalPages: this.totalPages,
      totalRecord: this.totalRecords
    }
  }

  isValidLimit() {
    return this.pageSize <= config.query_max_page_size && this.pageSize > 0;
  }

  async getData(_model, options = {}) {
    Object.assign(options, this.getOptions());
    const data = await _model.findAndCountAll(options);
    this.rows = data.rows;
    this.setTotal(data.count);
  }
}

export default Page;
