import { Injectable } from "@nestjs/common";
import { PAGINATION_CONSTANTS } from "./pagination.constants";

@Injectable()
export class PaginationService {

  constructor() { }

  async getTotalPagesValue(totalItems: number, items: any[]): Promise<number> {
    if (!items || (items && items.length == 0)) {
      return undefined;
    }

    let totalPages:number = -1;
    try {
      totalPages = items.length / totalItems;

      if (totalPages.toString().includes('.')) {
        totalPages = Math.floor(totalPages);
        totalPages = totalPages + 1;
      }
    } catch (error) {
      return undefined;
    }

    return totalPages;
  }

  async controlDefaultPaginationValues(page: number, totalItemsPage: number): Promise<any[]> {
    if (page != undefined && page <= 0) {
      page = 1;
    }

    if (totalItemsPage == undefined || totalItemsPage <= 0) {
      totalItemsPage = PAGINATION_CONSTANTS.TOTAL_ITEMS_PAGE;
    }

    return [page, totalItemsPage];
  }

  async getSkipValue(page: number, totalItemsPage: number): Promise<number> {
    let skip: number = 0;

    if (page != undefined && page > 1) {
      skip = (page - 1 ) * totalItemsPage;
    }

    return skip;
  }

  async controlIfCurrentPageIsGreaterThanLastPage(page: number, totalPages: number): Promise<number> {
    if (page != undefined && totalPages != undefined && page > totalPages) {
      page = totalPages;
    }
    
    return page;
  }
}
