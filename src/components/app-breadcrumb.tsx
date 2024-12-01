"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";

const AppBreadCrumb = () => {
  const pathname = usePathname();
  const seperated = pathname.split("/");
  const data = seperated.filter((item) => item != "");

  const path = (index: number) => {
    const res = "/" + data.slice(0, index + 1).join("/");
    return res;
  };

  const upperCaseFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbPage>
        </BreadcrumbItem>
        {data.map((item, i) => (
          <React.Fragment key={i}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <BreadcrumbLink href={path(i)}>
                  {upperCaseFirstLetter(item)}
                </BreadcrumbLink>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadCrumb;
