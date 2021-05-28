import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brands';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IProductType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', {static:false}) searchTerm: ElementRef | undefined; 
  products: IProduct[] = [];
  brands:IBrand[] = [];
  productTypes:IProductType[] = [];
  shopParams = new ShopParams;
  totalCount:number =0;
  sortOptions =[
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: low to high', value: 'priceAsc'},
    {name: 'Price: high to low', value: 'priceDesc'}
  ];

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTpes();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe(response =>{
      if(response){
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount =response.count;
      }
    }, error =>{
      console.log(error);
    });
  }
  getBrands(){
    this.shopService.getBrands().subscribe(response =>{
      this.brands = [{id:0, name:'all'}, ...response];
    }, error =>{
      console.log(error);
    })
  }
  getTpes(){
    this.shopService.getTpes().subscribe(response =>{
      this.productTypes = [{id:0, name:'all'}, ...response];
    }, error =>{
      console.log(error);
    })
  }

  onBrandSelected(brandId:number){
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber=1;
    this.getProducts();
  }

  onTypeSelected(typeId:number){
    this.shopParams.typeId =typeId;
    this.shopParams.pageNumber=1;
    this.getProducts();
  }
  onSortSelected(sort:string){
    this.shopParams.sort = sort;
    this.getProducts();
  }
  onPageChanged(event:any){
    if(this.shopParams.pageNumber !== event){
      this.shopParams.pageNumber = event;
      this.getProducts();
    }
    
  }
  onSearch(){
    if(this.searchTerm)
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber=1;
    this.getProducts();
  }
  onReset(){
    if(this.searchTerm)
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams;
    this.getProducts();
  }
}
